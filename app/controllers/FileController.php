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
		$user = Auth::user();
		$username = $user->username;
		return View::make('files')->with('uploads', $uploads)
			->with('username', $username);
	}

	/**
	 * Handle GET request for /get-file/id
	 *
	 * Tries to find the file using the uploads path listed in the
	 * config file, and the filename in the DB.  Returns a laravel
	 * response::download to try to serve up the file
	 * 
	 * @param  int $id ID of the upload in the DB
	 * @return Response     
	 */
	public function download_file($id) {
		$uploads_path = Config::get('uploads.path');
		$upload_db = Upload::find($id);
		if ($upload_db !== NULL) {
			$full_filename = $uploads_path . $upload_db->filename;
			if (file_exists($full_filename)) {
				return Response::download($full_filename);
			}
		}
	}

}