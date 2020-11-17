<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    const FOLLOWED = 1;
    const LIKED_POST = 2;
    const COMMENTED = 3;
    const LIKED_COMMENT = 4;
    
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
    public function format()
    {
        return $this->notificationStatus->user->only('gender, image_url');
    }
}
