<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserCommented implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $commenter;

    /**
     * Create a new event instance.
     *
     * @param \App\Models\User  $user
     * @param \App\Models\User  $commenter
     * @return void
     */
    public function __construct(User $user, User $commenter)
    {
        $this->user = $user;
        $this->commenter = $commenter;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('comment.notify.' . $this->user->id);
    }

    /**
     * Get the data broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'message' => "{$this->commenter->full_name} commented on your post."
        ];
    }
}
