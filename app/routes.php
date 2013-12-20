<?php

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| Available to all visitors
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
	Route::get('account', 'AccountController@action_account');
	Route::get('chat', 'ChatController@action_index');

	Route::post('send_chat', 'ChatController@handle_chat_message');
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
		return View::make('chat');
	}
	else {
		return View::make('login')->with('failed', 'failed');
	}
});