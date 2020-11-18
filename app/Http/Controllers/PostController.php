<?php

namespace App\Http\Controllers;

use App\Models\{Post, Comment, Notification};
use Illuminate\Http\Request;
use App\Events\NotifyUser;
use App\Repositories\{FetchRepository, NotificationRepository};

class PostController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @param App\Repositories\FetchRepository  $fetchRepository
     * @param App\Repositories\NotificationRepository  $notificationRepository
     * @return void
     */
    public function __construct(
        FetchRepository $fetchRepository,
        NotificationRepository $notificationRepository
    )
    {
        $this->fetchRepository = $fetchRepository;
        $this->notificationRepository = $notificationRepository;
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
        $posterId = Post::find($request->id)->user->id;

        $user->likes()->attach($request->id);

        if ($posterId !== $user->id) {
            $this->notificationRepository->store(
                $user,
                $posterId,
                Notification::LIKED_POST,
                "/home/post/{$request->id}"
            );
            
            event(new NotifyUser($posterId));
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
        
        return response()->json(['message' => 'Bookmarked!']);
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
        
        return response()->json(['message' => 'Unbookmarked!']);
    }

}
