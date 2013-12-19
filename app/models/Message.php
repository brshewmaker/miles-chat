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

}