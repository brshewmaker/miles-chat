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
			->with('user', $user);
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
		$file = Upload::find($id);
		if ($file !== NULL && file_exists(FileController::get_full_filepath($file->filename))) {
			FileController::serve_special_filetype($file);
			return Response::download(FileController::get_full_filepath($file->filename));
		}
		else {
			return Response::make('Error!  File not found', 404);
		}
	}

	/**
	 * If the given file ID matches a file that exists, delete that file and remove
	 * it's DB entry
	 *
	 * Only delete the file if the logged in user is the same as the file upload's user
	 * 
	 * @param  int $id ID of file in the DB
	 * @return JSON
	 */
	public function delete_file($id) {
		$upload = Upload::find($id);
		$user = Auth::user();
		if ($upload !== NULL && ($user->id == $upload->user_id)) {
			if (FileController::try_delete_file($upload->filename)) {
				$upload->delete();
				return Response::json(array('OK' => 1));
			}
		}
		return Response::json(array('ERROR' => 0));
	}

	/**
	 * Handle POST request to upload a file
	 *
	 * Puts the uploaded file in the uploads directory with the same filename
	 * as the upload, inserts a new DB entry, and sends a new chat message
	 * with the link to the uploaded file.  
	 * 
	 * @return JSON
	 */
	public function upload_file() {
		if (Input::hasFile('file')) {
			$upload = Input::file('file');
			$upload_info = FileController::get_file_upload_info($upload);

			 if (FileController::move_file_upload($upload, $upload_info['filename'])) {
			 	if ($upload = FileController::create_new_db_entry($upload_info['filename'], $upload_info['mimetype'], $upload_info['size'])) {
					ChatController::insert_chat_message('<b>File Upload: </b><a target="_blank" href="' . url('get-file/' . $upload->id) . '/' . $upload_info['filename'] . '">' . $upload_info['filename'] . '</a>'); //TODO  ---> FIX ME!!
					return Response::json(array('OK' => 1)); 
			 	}
			 	else {
			 		FileController::try_delete_file($upload_info['filename']);
			 	}
			 }
		}
		return Response::json(array('ERROR' => 0));
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
	 * Given the filename, return the full path name 
	 * 
	 * @param  string $filename filename
	 * @return string           fully qualified name
	 */
	public static function get_full_filepath($filename) {
		return realpath(Config::get('uploads.path')) . '/' . $filename;
	}

	/**
	 * Create an array of informatio needed for this file upload
	 * 
	 * @param Object $upload Uploaded file
	 * @return array Information about the uploaded file
	 */
	public static function get_file_upload_info($upload) {
		$info = array();

		$info['filename'] = $upload->getClientOriginalName();
		$info['mimetype'] = $upload->getMimeType();
		$info['size'] = FileController::get_human_filesize($upload->getSize());

		return $info;
		
	}

	/**
	 * Try to move the uploaded file to the uploads path set in the uploads config file
	 *
	 * Laravel's Filesystem::move() function simply calls PHP's rename(), which will
	 * simply overwrite a file if it already exists.  We don't want that to happen
	 * so it must first check if it exists.
	 *
	 * @param  Object $upload   uploaded file
	 * @param  string $filename given filename
	 * @return bool           Was the move successful?
	 */
	public static function move_file_upload($upload, $filename) {
		try {
			if (!file_exists(FileController::get_full_filepath($filename))) {
				return $upload->move(realpath(Config::get('uploads.path')), $filename); 
			}
			return FALSE;
		}
		catch (Exception $e) {
			return FALSE;
		}
	}

	/**
	 * Try to delete the file by the given filename
	 * 
	 * @param  string $filename filename
	 * @return bool           Did we delete it?
	 */
	public static function try_delete_file($filename) {
		try {
			unlink(FileController::get_full_filepath($filename));
		}
		catch (Exception $e) {
			return FALSE;
		}
		return TRUE;
	}


	/**
	 * Create a new DB upload file entry based on params
	 * 
	 * @param  string $filename 
	 * @param  string $type     
	 * @param  string $size     
	 * @return mixed The new database object or FALSE
	 */
	public static function create_new_db_entry($filename, $type, $size) {
		try {
			$user = Auth::user();
			$upload = new Upload;
			$upload->user_id = $user->id;
			$upload->filename = $filename;
			$upload->filetype = $type;
			$upload->filesize = $size;
			$upload->save();
			return $upload;
		}
		catch (Exception $e) {
			return FALSE;
		}
	}

	/**
	 * Serve a file without using the laravel Response if it is a valid filetype
	 * to serve in this fashion, otherwise return false
	 * 
	 * @param  array $file_info array of file information
	 * @return bool            
	 */
	public static function serve_special_filetype($file) {
		$valid_mime_types = array('image', 'application/pdf', 'audio', 'text', 'application/ogg');
		$mimetype_array = explode('/', $file->filetype);

		if (in_array($mimetype_array[0], $valid_mime_types) || in_array($file->filetype, $valid_mime_types)) {
			$full_filepath = FileController::get_full_filepath($file->filename);
			header('Content-Type: ' . $file->filetype);
			header('Content-Length: ' . filesize($full_filepath) );
			readfile($full_filepath);	
		}
		else {
			return FALSE;
		}
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