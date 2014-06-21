<?php 

/**
* Archive
*/
class ArchiveController extends BaseController
{
	
	/**
	 * Handle GET request for 'archive'
	 *
	 * Creates $messages pagination object and passes that to the view
	 * 
	 * @return View
	 */
	public function index() {
		$messages = Message::paginate(20);
		return View::make('archive')->with('messages', $messages);
	}

	/**
	 * Handle GET request for /archive/all/per-page/page-num
	 *
	 * Calculates the needed numbers for pagination, then returns the appropriate
	 * batch of messages from the DB.  If the given page_num is > num_pages, then it
	 * will return the last batch of messages it can
	 * 
	 * @param  int $per_page Number of results per page
	 * @param  int $page_num Current page number
	 * @return JSON           
	 */
	public function get_paginated_archives($per_page, $page_num) {
		// Let's do some math for the pagination
		$total_num = Message::all()->count();
		$num_pages = ceil($total_num/$per_page);
		$page_num = $page_num > $num_pages ? $num_pages : $page_num; //prevent asking for more pages than exist
		$first_message_id = Message::first()->id;
		$start_id = $page_num == 1 ?  $first_message_id : $first_message_id + (($page_num - 1) * $per_page);
		$end_id = $page_num == 1 ? ($first_message_id + $per_page) - 1 : ($start_id + $per_page) - 1;

		return Response::json(array(
			'totalMessages' => $total_num,
			'numPages' => $num_pages,
			'messages' => ChatController::create_messages_json(Message::get_messages_between($start_id, $end_id)),
		));
	}

}