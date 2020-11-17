<?php

namespace App\Repositories\Interfaces;

interface FetchRepositoryInterface
{
	public function fetch($models, $date);
}