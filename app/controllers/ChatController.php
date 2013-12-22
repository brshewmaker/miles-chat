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
	 * @return View
	 */
	public function action_index() {
		return View::make('chat');
	}

	/**
	 * Handle GET request for /get-chat-messages
	 *
	 * Calls helper functions to get messages based on the type
	 * of request.  
	 * 		
	 * @param  string $type
	 * @param  int $last_message_id 
	 * @return View
	 */
	public function action_get_chat_messages($type, $last_message_id = NULL) {
		if ($type == 'initial') {
			$messages = $this->get_initial_chat_messages();
		}
		else if ($type == 'newest' && $last_message_id !== NULL) {
			$messages = $this->get_new_chat_messages($last_message_id);
		}
		else { return Redirect::to('/');}
		return View::make('messages')->with('messages', $messages);
	}

	/**
	 * Handle POST request for sending a chat message
	 * 
	 * @return Response 
	 */
	public function post_chat_message() {
		$message = $this->run_htmlpurifier(Input::get('chatmsg'));
		$message = $this->sanitize_user_input($message);
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
	 * Get all messages within n number of days
	 *
	 * The number of days is set in the config file miles_chat_options
	 * 
	 * @return array
	 */
	public function get_initial_chat_messages() {
		$num_days_history = Config::get('miles_chat_options.num_days_history');
		$date_to_query = date('Y-m-d', strtotime('-' . $num_days_history . ' days', time()));
		$messages = Message::where('created_at', '>', $date_to_query)->get();
		return $this->create_messages_array($messages);
	}

	/**
	 * Get all messages later than the given message_id
	 * 
	 * @param  int $id DB id of a message
	 * @return array
	 */
	public function get_new_chat_messages($id) {
		$messages = Message::where('id', '>', $id)->get();
		return $this->create_messages_array($messages);
	}

	/**
	 * Given an array of Message objects, create an array of the data needed for the chat window
	 * 
	 * @param  array $messages 
	 * @return array
	 */
	public function create_messages_array($messages) {
		$recent_messages = array();
		foreach ($messages as $message) {
			$user = User::find($message->user_id);
			$recent_messages[] = array(
				'date'     => $message->created_at->toDateTimeString(),
				'username' => $user->username,
				'message'  => stripslashes($message->message),
				'id'       => $message->id
			);			
		}	
		return $recent_messages;			
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
	 * Run $message through the htmlpurifier library
	 *
	 * Settings for this are set in app/purifier.php.  This library
	 * will get rid of <Script> tags (among other things) and automatically
	 * add href tags to links.
	 * 
	 * @param  string $message string to purify
	 * @return string          purified string
	 */
	public function run_htmlpurifier($message) {
		return Purifier::clean($message, 'titles');
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