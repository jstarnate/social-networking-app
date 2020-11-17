<?php

namespace App\Repositories;

use App\Models\User;

use App\Repositories\Interfaces\NotificationRepositoryInterface;

class NotificationRepository implements NotificationRepositoryInterface
{

	/**
     * Store a newly created resource in storage.
     *
     * @param  object  $doer
     * @param  int  $userId
     * @param  int  $type
     * @param  string  $url
     * @return void
     */
	public function store(object $doer, int $userId, int $type, string $url)
	{
        $status = User::find($userId)->notificationStatuses()->firstOrCreate(['opened' => false]);

		$status->notifications()->create([
            'doer_id' => $doer->id,
            'type' => $type,
            'url' => $url,
        ]);
	}

}