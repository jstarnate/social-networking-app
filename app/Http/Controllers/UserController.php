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

    /**
     * Get a specific user model.
     *
     * @param  string  $username
     * @return \Illuminate\Http\Response
     */
    public function get(string $username)
    {
        $user = User::where('username', $username)->first();
        
        return response()->json([
            'user' => $user->formatHeadlineInfo()
        ]);
    }

    /**
     * Get the auth user data.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAuth()
    {
        return response()->json([
            'user' => auth()->user()->formatBasic()
        ]);
    }

    /**
     * Get 10 user models from storage.
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAll(Request $request)
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
     * @return \Illuminate\Http\Response
     */
    public function getConnectedUsers(Request $request, string $username, string $name)
    {
        $date = $request->date ?? now();
        $payload = User::where('username', $username)
                        ->first()
                        ->{$name}()
                        ->orderBy('pivot_created_at', 'desc')
                        ->wherePivot('created_at', '<', $date)
                        ->get()
                        ->take(5);

        $users = $payload->map(function($user) {
            $body = $user->formatBasic(auth()->user());
            $body['connected_at'] = $user->pivot->created_at;

            return $body;
        });

        $has_more = !$payload->isEmpty();

        return response()->json(compact('users', 'has_more'));
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
                    ->get()
                    ->random(3)
                    ->map(fn($u) => $u->formatBasic());

        return response()->json(compact('users'));
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
        $body = $request->only('full_name', 'username', 'location', 'bio');

        $user->update($body);

        return response()->json([
            'user' => auth()->user()->formatBasic()
        ]);
    }

    /**
     * Add the specified id in storage of followed user ids.
     *
     * @param \Illuminate\Http\Request  $request
     * @return void
     */
    public function follow(Request $request)
    {
        $this->authorize('followOrUnfollow', User::find($request->id));

        $user = auth()->user();

        $user->following()->attach($request->id);
        
        $this->notificationRepository->store(
            $user,
            $request->id,
            Notification::FOLLOWED,
            route('profile', $user->only('username'))
        );

        // TODO: Database notification for following a user.
        // event(new NotifyUser($request->id));
    }

    /**
     * Remove the specified id in storage of followed user ids.
     *
     * @param \Illuminate\Http\Request  $request
     * @return void
     */
    public function unfollow(Request $request)
    {
        $this->authorize('followOrUnfollow', User::find($request->id));
        
        auth()->user()->following()->detach($request->id);
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

        $results = User::where('full_name', 'like', "%$query%")
                    ->orWhere('username', 'like', "%$query%")
                    ->get()
                    ->take(5);
        $users = $results->map(fn($user) => collect($user->formatBasic())
                        ->except('id'));

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
        $ids = collect($request->ids)->merge(auth()->user()->id);
        $results = User::where(function($query) use ($request) {
                        $query->where('full_name', 'like', "%$request->sq%")
                            ->orWhere('username', 'like', "%$request->sq%");
                    })
                    ->whereNotIn('id', $ids)
                    ->get()
                    ->take(10);
        $items = $results->map(fn($u) => $u->formatBasic(auth()->user()));
        $has_more = !$results->isEmpty();

        return response()->json(compact('items', 'has_more'));
    }

    /**
     * Filter users according to sent requests body
     *
     * @return \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function filter(Request $request)
    {
        $body = collect($request->all())->filter(fn($data) => $data);
        $results = User::where(function($query) use ($request) {
                        $query->where('full_name', 'like', "%$request->sq%")
                            ->orWhere('username', 'like', "%$request->sq%");
                    })
                    ->where($body->toArray())
                    ->get()
                    ->take(10);
        $users = $results->map(fn($u) => $u->formatBasic(auth()->user()));

        return response()->json(compact('users'));
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

}
