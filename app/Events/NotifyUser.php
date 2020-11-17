<?php

namespace App\Events;

use App\Models\{User, Notification};
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotifyUser implements ShouldBroadcast
{

    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $receiverId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($receiverId)
    {
        $this->receiverId = $receiverId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('notify.' . $this->receiverId);
    }

    /**
     * Get the data broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        $unopened = User::find($this->receiverId)
                        ->notificationStatuses
                        ->where('opened', false)
                        ->first();

        $number = $unopened->notifications()
                           ->where('read', false)
                           ->count();

        return compact('number');
    }

}
