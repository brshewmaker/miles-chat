<?php 

/**
* For handling file uploads
*/
class FileController extends BaseController
{
	
	/*
	|--------------------------------------------------------------------------
	| GET/POST
	|--------------------------------------------------------------------------
	| 
	| Handle GEt/POST request from routes
	| 
	*/

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
		if ($full_file_path = $this->get_full_file_path($id)) {
			return Response::download($full_file_path);
		}
	}

	/**
	 * If the given file ID matches a file that exists, delete that file and remove
	 * it's DB entry
	 * 
	 * @param  int $id ID of file in the DB
	 * @return Redirect     
	 */
	public function delete_file($id) {
		$full_file_path = $this->get_full_file_path($id);
		$upload_db_entry = Upload::find($id);
		if ($full_file_path !== FALSE && $upload_db_entry !== NULL) {
			unlink($full_file_path);
			$upload_db_entry->delete();
		}		
		return Redirect::to('files');
	}

	/*
	|--------------------------------------------------------------------------
	| Helper functions
	|--------------------------------------------------------------------------
	| 
	| Extra functionality
	| 
	*/

	/**
	 * Given an ID for a file in the DB, see if the file exists, and if so return the full
	 * file path
	 * 
	 * @param  int $id ID of file in the DB
	 * @return string     FALSE on failure
	 */
	public function get_full_file_path($id) {
		$uploads_path = Config::get('uploads.path');
		$upload_db = Upload::find($id);
		if ($upload_db !== NULL) {
			$full_filename = $uploads_path . $upload_db->filename;
			if (file_exists($full_filename)) {
				return $full_filename;
			}
		}	
		return FALSE;
	}

}