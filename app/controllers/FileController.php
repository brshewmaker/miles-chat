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
	 * config file, and the filename in the DB. 
	 * 
	 * @param  int $id ID of the upload in the DB
	 * @return Response
	 */
	public function download_file($id) {
		$file_info = $this->get_file_info($id);
		if (is_array($file_info)) {
			$this->serve_special_filetype($file_info);
			return Response::download($file_info['full_filename']);
		}
		else {
			return Response::make('Error!  File not found', 404);
		}
	}

	/**
	 * If the given file ID matches a file that exists, delete that file and remove
	 * it's DB entry
	 * 
	 * @param  int $id ID of file in the DB
	 * @return JSON
	 */
	public function delete_file($id) {
		$file_info = $this->get_file_info($id);
		$upload_db_entry = Upload::find($id);
		if ($file_info !== FALSE && $upload_db_entry !== NULL) {
			unlink($file_info['full_filename']);
			$upload_db_entry->delete();
			return Response::json(array('OK' => 1));
		}
		return Response::json(array('ERROR' => 0));
	}

	/**
	 * Handle POST request to upload a file
	 *
	 * Puts the uploaded file in the uploads directory with the same filename
	 * as the upload, inserts a new DB entry, and sends a new chat message
	 * with the link to the uploaded file
	 * 
	 * @return JSON
	 */
	public function upload_file() {
		$uploads_path = realpath(Config::get('uploads.path'));
		if (Input::hasFile('file')) {
			// Uploaded file info
			$filename = Input::file('file')->getClientOriginalName();
			$filetype = Input::file('file')->getMimeType();
			$size = FileController::get_human_filesize(Input::file('file')->getSize());

			// Upload the file, create new db entry, and send a chat msg
			Input::file('file')->move($uploads_path, $filename);
			$upload_id = $this->create_new_db_entry($filename, $filetype, $size);
			ChatController::insert_chat_message('<b>File Upload: </b><a target="_blank" href="' . url('get-file/' . $upload_id) . '">' . $filename . '</a>'); //TODO  ---> FIX ME!!

			return Response::json(array('OK' => 1)); //a successful response for files.js
		}
		return Response::json(array('OK' => 0));
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
	 * Serve a file without using the laravel Response if it is a valid filetype
	 * to serve in this fashion, otherwise return false
	 * 
	 * @param  array $file_info array of file information
	 * @return bool            
	 */
	public function serve_special_filetype($file_info) {
		$valid_mime_types = array('image', 'application/pdf', 'audio', 'text');
		$filetype_array = explode('/', $file_info['filetype']);
		if (in_array($filetype_array[0], $valid_mime_types) || in_array($file_info['filetype'], $valid_mime_types)) {
			header('Content-Type: ' . $file_info['filetype']);
			header('Content-Length: ' . filesize($file_info['full_filename']));
			readfile($file_info['full_filename']);	
		}
		else {
			return FALSE;
		}
	}

	/**
	 * Given an ID for a file in the DB, see if the file exists, and if so 
	 * return an array with information about the file
	 * 
	 * @param  int $id ID of file in the DB
	 * @return array     FALSE on failure
	 */
	public function get_file_info($id) {
		$uploads_path = realpath(Config::get('uploads.path'));
		$upload_db = Upload::find($id);
		if ($upload_db !== NULL) {
			$full_filename = $uploads_path . '/' . $upload_db->filename;
			if (file_exists($full_filename)) {
				$file_info['full_filename'] = $full_filename;
				$file_info['filetype'] = $upload_db->filetype;
				$file_info['filesize'] = $upload_db->filesize;
				return $file_info;
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