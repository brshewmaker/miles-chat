<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('login');
});

Route::post('add-user', 'AccountController@action_add_user');
Route::get('register', 'AccountController@action_register');
Route::get('account', 'AccountController@action_account');
Route::get('chat', 'ChatController@action_index');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
| 
| Login/logout the user
| 
*/

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