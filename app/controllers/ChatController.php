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

	/**
	 * Handle GET request for /get-logged-in-users
	 *
	 * Queries the DB for all users with a last_seen time of 2 minutes or recent
	 * 
	 * @return View
	 */
	public function get_logged_in_users() {
		$users = User::where('last_seen', '>', Carbon\Carbon::now()->subMinutes(2))->get();
		$usernames = array();
		foreach ($users as $user) {
			$usernames[] = $user->username;
		}
		return View::make('logged_in_users')->with('users', $usernames);
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
	 * Updates the logged in user's last_seen column in the DB
	 * 
	 * @return null
	 */
	public function record_user_activity() {
		$user = Auth::user();
		$user->last_seen = Carbon\Carbon::now()->toDateTimeString();
		$user->save();		
	}

	/**
	 * Returns the 20 most recent chat messages for the initial loading of messages
	 *
	 * @return array
	 */
	public function get_initial_chat_messages() {
		$this->record_user_activity();
		$messages = DB::select(DB::raw('SELECT * FROM (
				SELECT * FROM messages ORDER BY id DESC LIMIT 20
			) sub 
			ORDER BY id ASC'));
		return $messages;
	}

	/**
	 * Get all messages later than the given message_id and update user last_seen time
	 * 
	 * @param  int $id DB id of a message
	 * @return array
	 */
	public function get_new_chat_messages($id) {
		$this->record_user_activity();
		$messages = DB::select(DB::raw('SELECT * FROM messages WHERE id > ' . $id));
		return $messages;
	}

	/**
	 * Insert the given chat message for the logged in user and update user last_seen time
	 * 
	 * @param  string $message 
	 * @return null
	 */
	public function insert_chat_message($message) {
		$this->record_user_activity();
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