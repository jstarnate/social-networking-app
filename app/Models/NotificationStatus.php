<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationStatus extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['opened'];

    /**
    * ============================================
    * RELATIONSHIPS
    * ============================================
    */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
    
    public function notifications()
    {
        return $this->hasMany('App\Models\Notification');
    }
}
