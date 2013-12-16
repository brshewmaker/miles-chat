<?php 

/**
* Chat
*/
class ChatController extends BaseController
{
	
	/**
	 * Handle GET request for /chat
	 * 
	 * @return View
	 */
	public function action_index() {
		return View::make('chat');
	}

}