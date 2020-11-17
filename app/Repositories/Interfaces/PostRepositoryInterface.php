<?php

namespace App\Repositories\Interfaces;

interface PostRepositoryInterface
{
	public function fetch($posts, $date);
}