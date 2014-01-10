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
		return Response::make('Error!  File not found', 404);
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

	/**
	 * Handle POST request to upload a file
	 *
	 * Puts the uploaded file in the uploads directory with the same filename
	 * as the upload, inserts a new DB entry, and sends a new chat message
	 * with the link to the uploaded file
	 * 
	 * @return Redirect
	 */
	public function upload_file() {
		$uploads_path = Config::get('uploads.path');
		if (Input::hasFile('fileupload')) {
			// Uploaded file info
			$filename = Input::file('fileupload')->getClientOriginalName();
			$extension = Input::file('fileupload')->getClientOriginalExtension();
			$size = FileController::get_human_filesize(Input::file('fileupload')->getSize());

			// Upload the file, create new db entry, and send a chat msg
			Input::file('fileupload')->move($uploads_path, $filename);
			$upload_id = $this->create_new_db_entry($filename, $extension, $size);
			ChatController::insert_chat_message('<a href="' . url('get-file/' . $upload_id) . '">' . $filename . '</a>'); //TODO  ---> FIX ME!!
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
	 * Create a new DB upload file entry based on params
	 * 
	 * @param  string $filename 
	 * @param  string $type     
	 * @param  string $size     
	 * @return int DB ID of the new upload entry
	 */
	public function create_new_db_entry($filename, $type, $size) {
		$user = Auth::user();
		$upload = new Upload;
		$upload->user_id = $user->id;
		$upload->filename = $filename;
		$upload->filetype = $type;
		$upload->filesize = $size;
		$upload->save();
		return $upload->id;
	}

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

	/**
	 * Given a size in bytes, return a human readable size
	 *
	 * Stolen from http://stackoverflow.com/questions/15188033/human-readable-file-size
	 * 
	 * @param  int  $size      size in bytes
	 * @param  integer $precision [description]
	 * @param  string  $show      
	 * @return string             
	 */
	public static function get_human_filesize($size, $precision = 1, $show = "")
	{
	    $b = $size;
	    $kb = round($size / 1024, $precision);
	    $mb = round($kb / 1024, $precision);
	    $gb = round($mb / 1024, $precision);

	    if($kb == 0 || $show == "B") {
	        return $b . " bytes";
	    } else if($mb == 0 || $show == "KB") {
	        return $kb . "KB";
	    } else if($gb == 0 || $show == "MB") {
	        return $mb . "MB";
	    } else {
	        return $gb . "GB";
	    }
	}

}