<?php 

/**
* ORM for the uploads database
*/
class Upload extends Eloquent
{
	
	/**
	 * Eloquent ORM definition linking uploads to their user
	 * 
	 * @return Eloquent
	 */
	public function user() {
		return $this->belongsTo('User');
	}

}