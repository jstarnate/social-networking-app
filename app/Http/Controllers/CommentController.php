<?php

namespace App\Http\Controllers;

use App\Models\{User, Post, Comment};
use Illuminate\Http\Request;
use App\Events\SendUnreadNotifsCount;
use App\Notifications\NewComment;
use App\Repositories\FetchRepository;

class CommentController extends Controller
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
     * Get 5 comment models from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get(Request $request)
    {
        $post = Post::find($request->postId);
        $body = $this->fetchRepository->fetch($post->comments(), $request->date);

        return response()->json($body);
    }

    /**
     * Notify the original poster or other commenters.
     * 
     * @param \App\Models\User  $op
     * @param number  $postId
     * @param \App\Models\User  $user
     * @return void
     */
    private function notifyUser(User $op, number $postId, User $user)
    {
        if ($op->id !== $user->id) { // If the commenter is not the OP, notify the OP.
            $op->notify(new NewComment($user, $postId, 'COMMENT'));
            broadcast(new SendUnreadNotifsCount($op));
        }
        else { // If the OP commented on his own post, notify each commenter.
            $commenters = User::where('id', '!=', $op->id)->get();

            $commenters->each(function($commenter) use ($user) {
                $commenter->notify(new NewComment($user, $postId, 'OP_COMMENT'));
                broadcast(new SendUnreadNotifsCount($commenter));
            });
        }
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
        $op = Post::find($request->id)->user;
        $comment = $user->comments()->create([
            'user_id' => auth()->user()->id,
            'post_id' => $request->id,
            'body' => $request->body,
        ]);

        $this->notifyUser($op, $request->id, $user);

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
