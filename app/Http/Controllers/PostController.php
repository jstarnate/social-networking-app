<?php

namespace App\Http\Controllers;

use App\Models\{User, Post, Comment};
use Illuminate\Http\Request;
use App\Events\SendUnreadNotifsCount;
use App\Notifications\PostLiked;
use App\Repositories\FetchRepository;

class PostController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @param App\Repositories\FetchRepository  $fetchRepository
     * @return void
     */
    public function __construct(FetchRepository $fetchRepository)
    {
        $this->fetchRepository = $fetchRepository;
    }

    /**
     * Get 5 post models from users
     * that are either followers or followed by auth user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {
        $user = auth()->user();
        $ids = $user->following->pluck('id')->merge($user->id);
        $posts = Post::whereIn('user_id', $ids);
        $body = $this->fetchRepository->fetch($posts, $request->date);

        return response()->json($body);
    }

    /**
     * Get a specific user model.
     *
     * @param \Illuminate\Http\Response  $request
     * @param string  $username
     * @param string  $section
     * @return \Illuminate\Http\Response
     */
    public function getFromProfile(Request $request, string $username, string $section)
    {
        $user = User::where('username', $username)->first();
        $payload = $user->{$section}()->orderBy('updated_at', 'desc')
                    ->{$section === 'likes' ? 'wherePivot' : 'where'}('updated_at', '<', $request->date ?: now())
                    ->get()
                    ->take(5);
        $items = $payload->map(fn($item) => $item->format());
        $has_more = !$payload->isEmpty();

        return response()->json(compact('items', 'has_more'));
    }

    /**
     * Get a specific post and the number of its comments.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function fetch(Request $request)
    {
        $getPost = Post::find($request->id);
        $post = $getPost->format();
        $commentsCount = $getPost->comments->count();

        return response()->json(compact('post', 'commentsCount'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'body' => ['required', 'string', 'max:250']
        ]);

        $newPost = auth()->user()->posts()->create($request->only('body'));
        $post = $newPost->format();

        return response()->json(compact('post'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Post  $post
     * @return void
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $commentIds = $post->comments->pluck('id');

        $post->likers()->detach();

        Comment::whereIn('id', $commentIds)->delete();

        $post->delete();

        return response()->json(['message' => 'Post deleted!']);
    }

    /**
     * Like a post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function like(Request $request)
    {
        $user = auth()->user();

        if ($user->likes->contains($request->id)) {
            return;
        }

        $op = Post::find($request->id)->user;

        $user->likes()->attach($request->id);

        if ($op->id !== $user->id) { // If the liked post is not from the auth user, notify OP.
            event(new SendUnreadNotifsCount($op));
            $op->notify(new PostLiked($user, $request->id));
        }

        return response()->json(['message' => 'Post liked!']);
    }

    /**
     * Dislike a post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function dislike(Request $request)
    {
        auth()->user()->likes()->detach($request->id);

        return response()->json(['message' => 'Post disliked!']);
    }

    /**
     * Bookmark a post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function bookmark(Request $request)
    {
        auth()->user()->bookmarks()->attach($request->id);
        
        return response()->json(['message' => 'Post successfully bookmarked.']);
    }

    /**
     * Remove/unbookmark a bookmarked post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function unbookmark(Request $request)
    {
        auth()->user()->bookmarks()->detach($request->id);
        
        return response()->json(['message' => 'Unbookmarked.']);
    }

}
