<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Casts\Timestamp;

class Post extends Model
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
    public function comments()
    {
        return $this->hasMany('App\Models\Comment');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function likers()
    {
        return $this->belongsToMany('App\Models\User', 'liker_post', 'post_id', 'liker_id');
    }

    public function bookmarkers()
    {
        return $this->belongsToMany('App\Models\User', 'bookmark_user', 'bookmark_id', 'user_id');
    }

    /**
    * ============================================
    * GETTERS
    * ============================================
    */
    public function getDateAttribute()
    {
        return $this->created_at->format('F d, Y');
    }

    /**
    * ============================================
    * FORMATTERS
    * ============================================
    */
    public function format()
    {
        $post = collect($this);
        $authUser = auth()->user();
        $user = $this->user->only('full_name', 'username', 'gender', 'image_url');
        $user['url'] = route('profile', ['username' => $user['username']]);

        $post['from_self'] = $authUser->id === $this->user_id;
        $post['is_liked'] = $authUser->likes->contains($this->id);
        $post['likes'] = $this->likers->count();
        $post['comments'] = $this->comments->count();
        $post['bookmarked'] = $this->bookmarkers->contains($authUser->id);
        $post['user'] = $user;

        return $post;
    }

}
