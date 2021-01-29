<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Repositories\FetchRepository;

class NotificationController extends Controller
{
	/**
     * Create a new controller instance.
     *
     * @param App\Repositories\FetchRepository  $fetchRepository
     * @return void
     */
    public function __construct(FetchRepository $fetchRepository)
    {
        $this->fetchRepository = $fetchRepository;
    }

	/**
	* Get 5 notification models from storage.
	*
	* @param \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
    */
	public function get(Request $request)
	{
		$notifications = auth()->user()->notifications();
		$body = $this->fetchRepository->fetch($notifications, $request->date);

		return response()->json($body);
	}

	/**
	* Get the number of unread notifications.
	*
	* @return array
    */
	public function getCount()
	{
		$count = auth()->user()->unreadNotifications->count();
		
		return compact('count');
	}

	/**
	* Update "read" status to true
	*
	* @param Illuminate\Http\Request  $request
	* @return void
    */
	public function read(Request $request)
	{
		auth()->user()->notifications->find($request->id)->markAsRead();
	}
}
