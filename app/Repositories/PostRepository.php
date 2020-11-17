<?php

namespace App\Repositories;

use App\Repositories\Interfaces\PostRepositoryInterface;

class PostRepository implements PostRepositoryInterface
{
    /**
     * Fetch 5 posts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $posts
     * @param  $date
     * @return array
     */
	public function fetch($posts, $date)
	{
		$payload = $posts->where('created_at', '<', $date ?: now())->get()->take(5);
        $posts = $payload->map(fn($post) => $post->format());
        $timestamp = $payload->count() ? $payload->last()->created_at : null;

        return compact('posts', 'timestamp');
	}
}