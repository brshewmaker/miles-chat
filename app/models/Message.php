<?php 

/**
* Message ORM
*/
class Message extends Eloquent
{
	
	/**
	 * Eloquent ORM definition linking messages to their user
	 * 
	 * @return Eloquent
	 */
	public function user() {
		return $this->belongsTo('User');
	}

	/**
	 * Get the $num most recent chat messages
	 *
	 * Messages are ordered by id ASC
	 * 
	 * @param  int $num Number of messages to retrive
	 * @return Object      
	 */
	public static function get_newest_messages($num) {
		$messages = DB::select(DB::raw('SELECT * FROM (
				SELECT * FROM messages ORDER BY id DESC LIMIT ' . $num . '
			) sub 
			ORDER BY id ASC'));
		return $messages;
	}

	/**
	 * Get all messages later than the given message_id
	 * 
	 * @param  int $id ID of last message
	 * @return Object
	 */
	public static function get_messages_since_id($id) {
		return DB::select(DB::raw('SELECT * FROM messages WHERE id > ' . $id));
	}

	/**
	 * Return all messages with IDs between $start and $end
	 * 
	 * @param  int $start Start ID
	 * @param  int $end   End ID
	 * @return Eloquent      
	 */
	public static function get_messages_between($start, $end) {
		return Message::whereBetween('id', array($start, $end))->get();
	}

	/**
	 * Given a start and end date, find the number of messages between those dates
	 * 
	 * @param  string $start 
	 * @param  string $end   
	 * @return int        
	 */
	public static function get_number_messages_in_date_range($start, $end) {
		return Message::whereBetween('created_at', array($start, $end))->count();
	}

	/**
	 * Given a date range, number of results per page and the current page number, return the messages
	 * for that result set
	 * 
	 * @param  string $start    
	 * @param  string $end      
	 * @param  int $per_page 
	 * @param  int $page_num 
	 * @return Eloquent
	 */
	public static function get_messages_for_date_pagination($start, $end, $per_page, $page_num) {
		$skip = ($page_num - 1) * $per_page;
		return Message::whereBetween('created_at', array($start, $end))->skip($skip)->take($per_page)->get();
	}

	/**
	 * Given results per page and current page number return messages for that result set
	 * 
	 * @param  int $per_page 
	 * @param  int $page_num 
	 * @return Eloquent           
	 */
	public static function get_messages_for_pagination($per_page, $page_num) {
		$skip = ($page_num - 1) * $per_page;
		return DB::table('messages')->skip($skip)->take($per_page)->get();
	}

	/**
	 * Return a list of all year/months that have messages
	 * 
	 * @return Object 
	 */
	public static function get_months_with_messages() {
		return DB::select(DB::raw('SELECT DISTINCT YEAR(created_at) as year, MONTHNAME(created_at) as month FROM messages ORDER BY MONTH(created_at)'));
	}

	/**
	 * Does a search against FULLTEXT index 
	 * @param  string $search_string 
	 * @return Eloquent
	 */
	public static function search_messages($search_string) {
		return DB::select(DB::raw('SELECT * FROM messages WHERE MATCH(message) AGAINST ("' . $search_string . '" IN NATURAL LANGUAGE MODE) LIMIT 50'));
	}

	

}