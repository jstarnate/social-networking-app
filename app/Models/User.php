<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'token',
        'remember_token',
        'email_verified_at',
        'created_at',
        'updated_at',
        'pivot'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
    * ============================================
    * RELATIONSHIPS
    * ============================================
    */
    public function posts()
    {
        return $this->hasMany('App\Models\Post');
    }

    public function comments()
    {
        return $this->hasMany('App\Models\Comment');
    }

    public function notificationStatuses()
    {
        return $this->hasMany('App\Models\NotificationStatus');
    }

    public function followers()
    {
        return $this->belongsToMany(self::class, 'follower_following', 'follower_id', 'following_id');
    }

    public function following()
    {
        return $this->belongsToMany(self::class, 'follower_following', 'following_id', 'follower_id');
    }

    public function likes()
    {
        return $this->belongsToMany('App\Models\Post', 'liker_post', 'liker_id', 'post_id')->withTimestamps();
    }

    public function bookmarks()
    {
        return $this->belongsToMany('App\Models\Post', 'bookmark_user', 'user_id', 'bookmark_id');
    }

    /**
    * ============================================
    * GETTERS
    * ============================================
    */
    public function getBirthDateAttribute()
    {
        $date = "{$this->birth_year}-{$this->birth_month}-{$this->birth_day}";

        return Carbon::parse($date)->format('F d, Y');
    }

    /**
    * ============================================
    * SETTERS
    * ============================================
    */
    public function setFirstNameAttribute($value)
    {
        $newValue = preg_replace_callback('/\b[a-z]/', fn($m) => strtoupper($m[0]), $value);
        $this->attributes['first_name'] = $newValue;
    }

    public function setLastNameAttribute($value)
    {
        $newValue = preg_replace_callback('/\b[a-z]/', fn($m) => strtoupper($m[0]), $value);
        $this->attributes['last_name'] = $newValue;
    }

    /**
    * ============================================
    * FORMATTERS
    * ============================================
    */
    public function formatBasic($currentUser = null)
    {
        $user = $this->only('id', 'full_name', 'username', 'gender', 'image_url');
        $user['url'] = "/u/{$this->username}";

        if ($currentUser) {
            $user['followed'] = $currentUser->following()->where('id', $this->id)->exists();
        }

        return $user;
    }

    public function formatHeadlineInfo()
    {
        $user = $this->only('id', 'full_name', 'username', 'gender', 'birth_date', 'bio', 'location', 'image_url');

        $user['not_self'] = $this->id !== auth()->user()->id;
        $user['followers'] = $this->followers->count();
        $user['following'] = $this->following->count();
        $user['is_followed'] = auth()->user()->following->contains($this->id);
        $user['date_joined'] = $this->created_at->format('F Y');

        return $user;
    }
}
