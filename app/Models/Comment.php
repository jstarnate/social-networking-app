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
    protected $fillable = ['body'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['user_id', 'updated_at', 'pivot'];

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
        $authUserId = auth()->user()->id;
        $comment = collect($this);

        $comment['from_self'] = $authUserId === $this->user_id;
        $comment['is_liked'] = $this->likers->contains($authUserId);
        $comment['user'] = $this->user->only('full_name', 'username', 'gender', 'image_url');

        return $comment;
    }
}
