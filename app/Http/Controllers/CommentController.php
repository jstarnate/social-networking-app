<?php

namespace App\Http\Controllers;

use App\Models\{Post, Comment, Notification};
use Illuminate\Http\Request;
use App\Events\UserCommented;
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
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {
        $post = Post::find($request->postId);
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
        $op = $post->user;
        $comment = $user->comments()->create([
            'user_id' => auth()->user()->id,
            'post_id' => $request->id,
            'body' => $request->body,
        ]);

        if ($op->id !== $user->id) {
            // If the commenter is not the auth user, notify the auth user.
            $this->notificationRepository->store(
                $user,
                $op->id,
                Notification::COMMENTED,
                "/posts/{$request->id}/comments"
            );
            
            event(new UserCommented($op, $user));
        }
        else {
            // If the auth user commented on his own post, notify each commenter.
            $otherUsersComments = $post->comments()->whereNotIn('user_id', [$op->id])->get();

            $otherUsersComments->each(function($c) use ($post, $request) {
                $this->notificationRepository->store(
                    $post->user,
                    $c->user_id,
                    Notification::COMMENTED,
                    "/posts/{$request->id}/comments"
                );

                event(new UserCommented($c->user, $user));
            });
        }

        return response()->json([
            'comment' => $comment->format()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return void
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Comment successfully deleted.']);
    }

}
