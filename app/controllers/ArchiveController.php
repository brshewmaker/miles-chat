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
		return View::make('archive');
	}

	/**
	 * Handle GET request for /archive/all/per-page/page-num
	 *
	 * Calculates the needed numbers for pagination, then returns the appropriate
	 * batch of messages from the DB.  
	 * 
	 * @param  int $per_page Number of results per page
	 * @param  int $page_num Current page number
	 * @return JSON           
	 */
	public function get_paginated_archives($per_page, $page_num) {
		$total_num = Message::all()->count();
		$num_pages = ceil($total_num/$per_page);

		return Response::json(array(
			'totalMessages' => $total_num,
			'numPages' => $num_pages,
			'messages' => ChatController::create_messages_json(Message::get_messages_for_pagination($per_page, $page_num)),
		));
	}

	/**
	 * Handle GET request for /archive/date/perpage/page/year/month
	 * 
	 * @param  int $per_page Number of results per page
	 * @param  int $page_num Current page number of pagination results
	 * @param  string $year     
	 * @param  string $month    
	 * @return JSON
	 */
	public function get_paginated_archives_for_date($per_page, $page_num, $year, $month) {
		$start_datetime = date('Y-m-d G:i:s', strtotime($year . $month));
		$end_datetime = date('Y-m-d G:i:s', strtotime($year . $month . '+1 month'));
		$total_num = Message::get_number_messages_in_date_range($start_datetime, $end_datetime);
		$num_pages = ceil($total_num/$per_page);

		return Response::json(array(
			'totalMessages' => $total_num,
			'numPages' => $num_pages,
			'messages' => ChatController::create_messages_json(Message::get_messages_for_date_pagination($start_datetime, $end_datetime, $per_page, $page_num)),
		));
	}

	/**
	 * Handle GET request for /archive/date/list
	 *
	 * Get a list of all months/years that have entries in the DB, then returns those as JSON
	 * 
	 * @return JSON 
	 */
	public function list_months_with_messages() {
		$month_list = Message::get_months_with_messages();
		$month_list_json = array();
		foreach ($month_list as $entry => $month) {
			$month_list_json[$month->year][] = $month->month;
		}
		return Response::json($month_list_json);
	}

	public function search_messages() {
		$search_string = Input::get('search');
		return Response::json(ChatController::create_messages_json(Message::search_messages($search_string)));
	}

}