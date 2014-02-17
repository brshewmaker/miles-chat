<?php 

/**
* Archive
*/
class ArchiveController extends BaseController
{
	
	/**
	 * Handle GET request for 'archive'
	 * 
	 * @return View
	 */
	public function index() {
		return View::make('archive');
	}

}