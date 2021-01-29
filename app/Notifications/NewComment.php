<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewComment extends Notification
{
    use Queueable;

    public $user;
    public $postId;
    public $eventType;

    /**
     * Create a new notification instance.
     *
     * @param \App\Models\User  $user
     * @param number  $postId
     * @param string  $eventType
     * @return void
     */
    public function __construct(User $user, number $postId, string $eventType)
    {
        $this->user = $user;
        $this->postId = $postId;
        $this->eventType = $eventType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'name' => $this->user->full_name,
            'gender' => $this->user->gender,
            'image_url' => $this->user->image_url,
            'url' => "/posts/{$this->postId}/comments",
            'event_type' => $this->eventType,
        ];
    }
}
