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

}