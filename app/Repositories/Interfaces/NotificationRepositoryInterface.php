<?php

namespace App\Repositories\Interfaces;

interface NotificationRepositoryInterface
{
	public function store(object $doer, int $userId, int $type, string $url);
}