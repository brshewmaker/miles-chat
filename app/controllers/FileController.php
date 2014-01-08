<?php 

/**
* For handling file uploads
*/
class FileController extends BaseController
{
	
	/**
	 * Handle GET request for /files
	 * 
	 * @return View
	 */
	public function action_index() {
		return View::make('files');
	}

}