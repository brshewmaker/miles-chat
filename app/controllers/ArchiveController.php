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

}