<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Casts\Timestamp;

class Comment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'post_id', 'body'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['user_id', 'pivot'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => Timestamp::class,
    ];

    /**
    * ============================================
    * RELATIONSHIPS
    * ============================================
    */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function post()
    {
        return $this->belongsTo('App\Models\Post');
    }

    /**
    * ============================================
    * FORMATTERS
    * ============================================
    */
    public function format()
    {
        $comment = collect($this);
        $user = $this->user->only('full_name', 'username', 'gender', 'image_url', 'updated_at');
        $user['url'] = "/u/{$user['username']}";

        $comment['kind'] = 'comment';
        $comment['from_self'] = auth()->user()->id === $this->user_id;
        $comment['user'] = $user;

        return $comment;
    }
}
