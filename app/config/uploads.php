<?php 

/*
|--------------------------------------------------------------------------
| Path to Uploads
|--------------------------------------------------------------------------
| 
| By default, it uses the uploads/ path within the root directory of the
| project.  However, you can supply a full path here if you want the uploads
| somewhere else.
| 
*/

$default_uploads_path = realpath(dirname(__FILE__) . '/../../uploads');

return array(
	'path' => $default_uploads_path,
);