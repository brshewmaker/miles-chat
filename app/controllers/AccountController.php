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
	 * Handle POST request to change the user password
	 *
	 * Checks the current users password, makes sure that matches,
	 * then in the form validation rules pass, updates the user password
	 * 
	 * @return View
	 */
	public function action_edit_user() {
		$user = Auth::user();
		$current_password = Input::get('currentpassword');
		$input = array(
			'password' => Input::get('password'),
			'password_confirmation' => Input::get('confirmpassword'),
		);		
		$validation_rules = array('password' => 'required|min:8|confirmed');
		$validation = Validator::make($input, $validation_rules);
		if ((Hash::check($current_password, $user->password)) && $validation->passes()) {
			$user->password = Hash::make($input['password']);
			$user->save();
			return View::make('account')->with('passed', 'Changed password');
		}
		else {
			return View::make('account')->with('failed', 'Did not work');
		}
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
			'username' => 'required|alpha_num|unique:users',
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
			return Redirect::to('/chat');
		}
		else {
			return View::make('register')->with('failed', 'Failed to create user');
		}
	}

	

}