<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\RegistrationRequest;
use App\Notifications\{VerifyUserEmail, SendResetPasswordRequest};
use Illuminate\Auth\Events\{Verified, PasswordReset};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, URL, Hash};
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    
    /**
     * Handle a login request to the application.
     *
     * @param \Illumiate\Http\RHashequest  $request
     * @return \Illumiate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        if (isset($request->username) && !isset($request->password)) {
            throw ValidationException::withMessages([
                'message' => 'Please enter your password.'
            ]);
        }

        if (!isset($request->username) && isset($request->password)) {
            throw ValidationException::withMessages([
                'message' => 'Please enter your username.'
            ]);
        }

        $correct = auth()->attempt($request->only('username', 'password'), $request->filled('remember'));

        if (!$correct) {
            throw ValidationException::withMessages([
                'message' => 'The combination you entered does not exist.'
            ]);
        }

        if ($correct && !$request->user()->hasVerifiedEmail() && $request->user()->token) {
            auth()->logout();
            
            throw ValidationException::withMessages([
                'message' => 'Sorry, your account is not yet verified.'
            ]);
        }

        $request->session()->regenerate();

        auth()->login($request->user());

        return response()->json(['url' => route('home')]);
    }

    /**
    * Handle a registration request for the application.
    *
    * @param \App\Http\Requests\RegistrationRequest  $request
    * @return \Illumiate\Http\RedirectResponse
    */
    public function register(RegistrationRequest $request)
    {
        $body = $request->only([
            'first_name', 'last_name', 'email', 'username',
            'gender', 'birth_day', 'birth_month', 'birth_year',
        ]);

        $body['password'] = Hash::make($request->password);
        $body['token'] = hash('sha256', Str::random(10));
        $user = User::create($body);

        $user->notificationStatuses()->create();

        $user->notify(new VerifyUserEmail($user->token));

        return response()->json(['url' => route('index')]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  string  $token
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function verify(string $token)
    {
        $user = User::where('token', $token);

        if ($user->first()->hasVerifiedEmail()) {
            return redirect()->route('index');
        }

        event(new Verified($user->first()));

        session()->regenerate();

        auth()->login($user->first());
        
        $user->update([
            'email_verified_at' => now(),
            'token' => null,
        ]);

        // TODO: change the route to profile and add "username" parameter.
        return redirect()->route('home');
    }

    /**
	* Send a notification email for resetting of user's password.
	*
	* @param \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\RedirectResponse
    */
    public function sendPasswordResetNotification(Request $request)
    {
    	$request->validate([
    		'email' => ['required', 'email', 'exists:users']
    	]);

    	$user = User::where('email', $request->email)->first();
        $token = hash_hmac('sha256', Str::random(40), $request->email);

        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => now()
        ]);

    	$user->notify(new SendResetPasswordRequest($token));

    	return response()->json(['message' => 'Success!']);
    }

    /**
    * Show the reset password page.
    *
    * @param string  $token
    * @return \Illuminate\View\View|Illuminate\Http\RedirectResponse
    */
    public function showResetPasswordForm(string $token)
    {
        $tokenExists = DB::table('password_resets')->where(compact('token'))->exists();

        if (!isset($token) || !$tokenExists) {
            abort(404);
        }

        return view('reset-password', compact('token'));
    }

    /**
	 * Update the user's password in storage.
	 *
	 * @param Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function resetPassword(Request $request)
    {
    	$request->validate([
    		'password' => ['required', 'min:8', 'regex:/^[a-zA-Z0-9]+$/'],
            'password_confirmation' => ['required', 'same:password']
        ]);

        $token = Str::replaceFirst(url()->current() . '/', '', url()->previous());
        $email = DB::table('password_resets')->where('token', $token)->first()->email;
        $user = User::where('email', $email);

    	if (Hash::check($request->password, $user->first()->password)) {
    		throw ValidationException::withMessages([
                'password' => 'Please enter a password different from your current one'
            ]);
    	}

    	$user->update(['password' => Hash::make($request->password)]);

    	event(new PasswordReset($user->first()));

    	session()->flush();

    	return response()->json([
            'message' => 'You have successfully changed your password.'
        ]);
    }
    
}
