<?php

namespace App\Models;

use App\Models\User;
use App\Casts\Timestamp;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    const FOLLOWED = 1;
    const LIKED_POST = 2;
    const COMMENTED = 3;
    const COMMENTED_ON_OWN = 4;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'doer_id',
        'type',
        'url',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'notification_status_id',
        'doer_id',
        'updated_at',
    ];

    protected $casts = [
        'created_at' => Timestamp::class,
    ];

    /**
    * ============================================
    * RELATIONSHIPS
    * ============================================
    */
    public function notificationStatus()
    {
        return $this->belongsTo('App\Models\NotificationStatus');
    }

    /**
    * ============================================
    * FORMATTERS
    * ============================================
    */
    protected function generateMessage(string $name, string $gender) {
        if ($this->type === self::FOLLOWED) {
            return "$name followed you.";
        }

        if ($this->type === self::LIKED_POST) {
            return "$name liked your post.";
        }

        if ($this->type === self::COMMENTED) {
            return "$name commented on your post.";
        }

        if ($this->type === self::COMMENTED_ON_OWN) {
            $g = $gender === 'Male' ? 'his' : 'her';
            return "$name commented on $g post.";
        }
    }

    public function format()
    {
        $notif = collect($this)->only('id', 'url', 'read', 'created_at');
        $notif['user'] = User::find($this->doer_id)->formatBasic();
        $notif['message'] = $this->generateMessage(
                                $notif['user']['full_name'],
                                $notif['user']['gender']
                            );

        return $notif;
    }
}
