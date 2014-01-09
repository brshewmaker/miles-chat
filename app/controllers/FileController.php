<?php 

/**
* For handling file uploads
*/
class FileController extends BaseController
{
	
	/**
	 * Handle GET request for /files
	 *
	 * Gets all upload entries from the DB and passes those
	 * to the view so that the uploads table can be built
	 * 
	 * @return View
	 */
	public function action_index() {
		$uploads = Upload::all();
		return View::make('files')->with('uploads', $uploads);
	}

}