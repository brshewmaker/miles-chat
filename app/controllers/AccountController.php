<?php 

/**
* Account Controller
*/
class AccountController extends BaseController
{
	
	/**
	 * Handle GET request for registration page
	 * 
	 * @return View
	 */
	public function action_register() {
		return View::make('register');
	}

	/**
	 * Handle GET request for /account
	 * 
	 * @return View
	 */
	public function action_account() {
		return View::make('account');
	}

	/**
	 * Handle POST request to add-user
	 *
	 * Attempts to add a new user to the DB based on input from the form
	 * and puts that input through a validator
	 * 
	 * @return View
	 */
	public function action_add_user() {
		$input = array(
			'username' => Input::get('username'),
			'password' => Input::get('password'),
			'password_confirmation' => Input::get('confirmpassword'),
		);
		$validation_rules = array(
			'username' => 'required|unique:users',
			'password'  => 'required|min:8|confirmed',
		);

		$validation = Validator::make($input, $validation_rules);
		if ($validation->passes()) {
			// Add User
			$user = new User();
			$user->username = $input['username'];
			$user->password = Hash::make($input['password']);
			$user->save();
			// Login user
			Auth::login($user, TRUE); //2nd argument is to remember this user
			return View::make('chat');
		}
		else {
			return View::make('register')->with('failed', 'Failed to create user');
		}
	}

	

}