<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Events\SendUnreadNotifsCount;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
	/**
	* Get 5 notification models from storage.
	*
	* @param \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
    */
	public function get(Request $request)
	{
		$notifications = auth()->user()->notifications()
							->orderBy('created_at', 'desc')
							->where('created_at', '<', $request->date ?: now())
							->get()
							->take(5);

		$items = $notifications->map(function($notif) {
			$notif->time_diff = $notif->created_at->diffForHumans();
			return $notif;
		});

		$has_more = !$items->isEmpty();

		return response()->json(compact('items', 'has_more'));
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
		broadcast(new SendUnreadNotifsCount(auth()->user()));
	}
}
