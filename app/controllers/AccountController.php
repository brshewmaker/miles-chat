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
	public function action_index() {
		Return View::make('register');
	}

}