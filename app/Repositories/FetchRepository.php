<?php

namespace App\Repositories;

use App\Repositories\Interfaces\FetchRepositoryInterface;

class FetchRepository implements FetchRepositoryInterface
{
    /**
     * Fetch 5 models from database.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $models
     * @param  $date
     * @return array
     */
	public function fetch($models, $date)
	{
        $payload = $models->orderBy('updated_at', 'desc')
                    ->where('updated_at', '<', $date ?: now())
                    ->get()
                    ->take(5);
                    
        $items = $payload->map(fn($item) => $item->format());
        $has_more = !$payload->isEmpty();

        return compact('items', 'has_more');
	}
}