<?php

namespace App\Http\Controllers;

use App\Models\{User, Notification};
use Illuminate\Http\Request;
use App\Http\Requests\UpdateUserRequest;
use App\Events\NotifyUser;
use App\Repositories\NotificationRepository;
use Illuminate\Validation\ValidationException;
use JD\Cloudder\Facades\Cloudder;

class UserController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(NotificationRepository $notificationRepository)
    {
        $this->notificationRepository = $notificationRepository;
    }

    public function getAuthUser()
    {
        return response()->json([
            'user' => auth()->user()->formatBasic()
        ]);
    }

    /**
     * Get a specific user model.
     *
     * @param  string  $username
     * @return \Illuminate\Http\Response
     */
    public function getUser(string $username)
    {
        $data = User::where('username', $username)->first();
        $user = collect($data)->except('id', 'email', 'birth_month', 'birth_day', 'birth_year');
        $user['birth_date'] = $data->birth_date;
        
        return response()->json(compact('user'));
    }

    /**
     * Get a specific user model.
     *
     * @param  string  $username
     * @param  string  $name
     * @return \Illuminate\Http\Response
     */
    public function getConnectedPosts(string $username, string $name)
    {
        $names = ['posts', 'likes', 'comments', 'bookmarks'];

        if (!in_array($name, $names)) {
            abort(400);
        }

        $user = User::where('username', $username)->first();
        $posts = $user->{$name}->map(fn($post) => $post->format());
        
        return response()->json(compact('posts'));
    }

    /**
     * Get 10 user models from storage.
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetchUsers(Request $request)
    {
        $user = auth()->user();
        $notIds = $user->following->pluck('id')->merge($user->id, $request->ids);
        $payload = User::whereNotIn('id', $notIds)->get()->random(10);
        $users = $payload->map(fn($u) => $u->formatBasic());
        $ids = $payload->pluck('id');

        return response()->json(compact('users', 'ids'));
    }

    /**
     * Get 5 followers or followed users
     *
     * @param \Illuminate\Http\Request  $request
     * @param string  $username
     * @param string  $name
     * @return \Illuminate\Http\Response
     */
    public function getConnectedUsers(Request $request, string $username, string $name)
    {
        if ($name !== 'followers' && $name !== 'following') {
            abort(400);
        }

        $payload = User::where('username', $username)->first()
                        ->{$name}()->latest()
                        ->whereNotIn('id', $request->ids)
                        ->get()->take(10);

        $users = $payload->map(function($user) {
            $u = $user->only('id', 'full_name', 'username', 'gender', 'image_url');
            $u['url'] = route('profile', $user->only('username'));

            return $u;
        });

        return response()->json(compact('users'));
    }

    /**
     * Get 3 random suggested user models from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function getSuggestedUsers()
    {
        $user = auth()->user();
        $exceptions = $user->following->pluck('id')->merge($user->id);
        $users = User::whereNotIn('id', $exceptions)
                    ->get()->random(3)
                    ->map(fn($u) => $u->formatBasic());

        return response()->json(compact('users'));
    }

    /**
     * Search the specified users
     *
     * @return \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $query = $request->query('sq');

        if (!isset($query)) {
            return response()->json([
                'users' => []
            ]);
        }

        $results = User::whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%$query%"])
                    ->orWhere('username', 'like', "%$query%")
                    ->get()
                    ->take(5);
        $users = $results->map(fn($user) => collect($user->formatBasic())->except('id'));

        return response()->json(compact('users'));
    }

    /**
     * Search the specified searched users
     *
     * @return \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getSearchResults(Request $request)
    {
        $user = auth()->user();
        $following = $user->following->pluck('id')->merge($user->id);
        $results = User::whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%$request->sq%"])
                    ->orWhere('username', 'like', "%$request->sq%")
                    ->whereNotIn('id', $request->ids)
                    ->get()
                    ->take(10);
        $users = $results->map(fn($u) => $u->formatBasic(auth()->user()));

        return response()->json(compact('users'));
    }

    /**
     * Show a specific user's profile.
     *
     * @param  string  $username
     * @return \Illuminate\View\View
     */
    public function show(string $username)
    {
        if (!User::where('username', $username)->exists()) {
            abort(404);
        }

        return view('home');
    }

    /**
     * Display image and get its output url
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function upload(Request $request)
    {
        $this->authorize('update', User::find($request->id));

        $image = $request->file('image');
        $size = 240;
        list($width, $height) = getimagesize($image);

        if ($width > $size || $height > $size) {
            throw ValidationException::withMessages(['image' => "Maximum is {$size}x{$size}."]);
        }

        Cloudder::upload($image->getRealPath(), null, ['folder' => 'social']);

        $url = Cloudder::show(Cloudder::getPublicId(), ['width' => $size, 'height' => $size]);

        return response()->json(compact('url'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  App\Http\Requests\UpdateUserRequest  $request
     * @return Illuminate\Http\Response
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(UpdateUserRequest $request)
    {
        $this->authorize('update', User::find($request->id));

        $user = User::where('id', auth()->user()->id);
        $body = $request->except('id', 'username');

        if ($request->username !== $user->first()->username) {
            $body['username'] = $request->username;
        }

        $user->update($body);

        return response()->json(['message' => 'Success']);
    }

    /**
     * Add the specified id in storage of followed user ids.
     *
     * @param \Illuminate\Http\Request  $request
     * @return void
     */
    public function follow(Request $request)
    {
        $this->authorize('follow', User::find($request->id));

        $user = auth()->user();

        $user->following()->attach($request->id);
        
        $this->notificationRepository->store(
            $user,
            $request->id,
            Notification::FOLLOWED,
            route('profile', $user->only('username'))
        );

        event(new NotifyUser($request->id));
    }

    /**
     * Remove the specified id in storage of followed user ids.
     *
     * @param \Illuminate\Http\Request  $request
     * @return void
     */
    public function unfollow(Request $request)
    {
        $this->authorize('unfollow', User::find($request->id));
        
        auth()->user()->following()->detach($request->id);
    }

}
