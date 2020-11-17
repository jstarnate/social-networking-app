<?php

namespace App\Http\Controllers;

use App\Modesl\{User, Notification};
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
	* Change the status of "opened" to true.
	*
	* @return \Illuminate\View\View
    */
	public function updateStatus()
	{
		$statuses = auth()->user()->notificationStatuses();
		$statuses->where('opened', false)->update(['opened' => true]);
	}

	/**
	* Get 5 notification models from storage.
	*
	* @param \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
    */
	public function get(Request $request)
	{
		$statusIds = auth()->user()->notificationStatuses->pluck('id');
		$notifications = Notification::latest()->whereIn('notification_status_id', $statusIds);
		$body = $this->fetchRepository->fetch($notifications, $request->date);

		return response()->json($body);
	}

	/**
	* Update "read" status to true
	*
	* @param Illuminate\Http\Request  $request
	* @return void
    */
	public function read(Request $request)
	{
		$ids = auth()->user()->notificationStatuses->pluck('id');
		$notification = Notification::whereIn('notification_status_id', $ids)->where('id', $request->id);

		if (!$notification->first()->read) {
			$notification->update(['read' => true]);
		}

		return;
	}

	/**
	* Get the number of unread notifications.
	*
	* @return array
    */
	public function getCount()
	{
		$status = auth()->user()->notificationStatuses()->where('opened', false)->first();
		$count = !$status ? 0 : $status->notifications()->where('read', false)->count();
		
		return compact('count');
	}
    
}
