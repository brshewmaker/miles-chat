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

	/**
	 * Handle POST request for sending a chat message
	 * 
	 * @return Response 
	 */
	public function handle_chat_message() {
		$message = $this->sanitize_user_input(Input::get('chatmsg'));
		$this->insert_chat_message($message);
		$response = array('message' => $message);
		return Response::json($response);
	}

	/**
	 * Insert the given chat message for the logged in user
	 * 
	 * @param  string $message 
	 * @return null
	 */
	public function insert_chat_message($message) {
		$user = Auth::user();
		$db_message = new Message();
		$db_message->user_id = $user->id;
		$db_message->message = $message;
		$db_message->save();
	}

	/**
	 * Sanitize the user input
	 *
	 * For now, this only uses mysql_real_escape_string, but adding the
	 * function here in case I want to do something more elaborate later
	 * 
	 * @param  string $message 
	 * @return string
	 */
	public function sanitize_user_input($message) {
		return mysql_real_escape_string($message);
	}

}