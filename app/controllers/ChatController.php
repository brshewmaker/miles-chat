<?php 

/**
* Chat
*/
class ChatController extends BaseController
{
	
	/*
	|--------------------------------------------------------------------------
	| Handle HTTP requests
	|--------------------------------------------------------------------------
	| 
	| GET/POST
	| 
	*/

	/**
	 * Handle GET request for /chat
	 *
	 * Gets all messages from the n most recent days, where n is a value
	 * set in the miles_chat_options file
	 * 
	 * @return View
	 */
	public function action_index() {
		$num_days_history = Config::get('miles_chat_options.num_days_history');
		$date_to_query = date('Y-m-d', strtotime('-' . $num_days_history . ' days', time()));
		$messages = Message::where('created_at', '>', $date_to_query)->get();
		$recent_messages = array();
		foreach ($messages as $message) {
			$user = User::find($message->user_id);
			$recent_messages[] = array(
				'date'     => $message->created_at->toDateTimeString(),
				'username' => $user->username,
				'message'  => $message->message,
			);
		}
		return View::make('chat')->with('recent_messages', $recent_messages);
	}

	/**
	 * Handle POST request for sending a chat message
	 * 
	 * @return Response 
	 */
	public function post_chat_message() {
		$message = $this->sanitize_user_input(Input::get('chatmsg'));
		$this->insert_chat_message($message);
		$response = array('message' => $message);
		return Response::json($response);
	}

	/*
	|--------------------------------------------------------------------------
	| Helper functions
	|--------------------------------------------------------------------------
	| 
	| These are used by the above functions
	| 
	*/

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