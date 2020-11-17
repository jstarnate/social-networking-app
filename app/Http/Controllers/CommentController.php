<?php

namespace App\Http\Controllers;

use App\Models\{Post, Comment, Notification};
use Illuminate\Http\Request;
use App\Events\NotifyUser;
use App\Repositories\{FetchRepository, NotificationRepository};

class CommentController extends Controller
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
     * Get 5 comment models from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request, Post $post)
    {
        $body = $this->fetchRepository->fetch(
                    $post->comments(),
                    $request->date
                );

        return response()->json($body);
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
            'body' => ['string', 'max:250']
        ]);
        
        $user = auth()->user();
        $post = Post::find($request->id);
        $posterId = $post->user->id;
        $comment = $user->comments()->create($request->only('body'));

        $comment->posts()->attach($request->id);

        if ($posterId !== $user->id) {
            $this->notificationRepository->store(
                $user,
                $posterId,
                Notification::COMMENTED,
                "/home/post/{$request->id}"
            );
            
            event(new NotifyUser($posterId));
        }
        else {
            $otherUsersComments = $post->comments()->whereNotIn('user_id', [$posterId])->get();

            $otherUsersComments->each(function($c) use ($post, $request) {
                $this->notificationRepository->store(
                    $post->user,
                    $c->user_id,
                    Notification::COMMENTED,
                    "/home/post/{$request->id}"
                );

                event(new NotifyUser($c->user_id));
            });
        }

        return response()->json(['comment' => $comment->format($user)]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return void
     */
    public function destroy(int $id)
    {
        $this->authorize('delete', $comment = Comment::find($id));

        $comment->posts()->detach();
        $comment->delete();
    }

}
