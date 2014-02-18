<?php

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| Available to all visitors.  Authentication and user create routes
| are publicly available, but listed in a diff. part of this file
|
*/

Route::get('/', function()
{
	return View::make('login');
});

/*
|--------------------------------------------------------------------------
| Application (authenticated) routes
|--------------------------------------------------------------------------
| 
| For logged in users
| 
*/

Route::group(array('before' => 'auth'), function() {
	// Account
	Route::get('account', 'AccountController@action_account');

	// Chat
	Route::get('chat', 'ChatController@action_index');

	// Files
	Route::get('files', 'FileController@action_index');
	Route::get('get-file/{id}', 'FileController@download_file');
	Route::get('delete-file/{id}', 'FileController@delete_file');
	Route::post('upload-file', 'FileController@upload_file');

	// Archive
	Route::get('archive', 'ArchiveController@index');

	// Chat messages
	Route::get('get-chat-messages/{type}/{id?}', 'ChatController@action_get_chat_messages');
	Route::post('send_chat', 'ChatController@post_chat_message');

	// Chat check online users
	Route::get('check-in', 'ChatController@check_in_user');
	Route::get('get-logged-in-users', 'ChatController@get_logged_in_users');
});


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
| 
| Login/logout/register the user
| 
*/

Route::post('add-user', 'AccountController@action_add_user');
Route::post('edit-user', 'AccountController@action_edit_user');
Route::get('register', 'AccountController@action_register');

Route::get('logout', function() {
	Auth::logout();
	return Redirect::to('/');
});

Route::post('login', function() {
	$userdata = array(
		'username' => Input::get('username'),
		'password' => Input::get('password'),
	);
	$remember_input = Input::get('remember');
	$remember_me = $remember_input !== NULL ? TRUE : NULL;
	if (Auth::attempt($userdata, $remember_me)) { //TRUE means to remember this user
		return Redirect::to('chat');
	}
	else {
		return View::make('login')->with('failed', 'failed');
	}
});