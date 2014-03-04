<?php 

/*
|--------------------------------------------------------------------------
| Path to Uploads
|--------------------------------------------------------------------------
| 
| By default, it uses the uploads/ path within the public directory of the
| project.  However, you can supply a full path here if you want the uploads
| somewhere else.  Just make sure the server user has read/write access
| 
*/

$default_uploads_path = realpath(dirname(__FILE__) . '/../../public/uploads');

return array(
	'path' => $default_uploads_path,
);