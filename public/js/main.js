var CHAT = CHAT || {};

$(document).ready(function() {

	/*
	|--------------------------------------------------------------------------
	| Setting stylesheets
	|--------------------------------------------------------------------------
	| 
	| Get and set stylesheets from cookies
	| 
	*/

	/**
	 * Changes the given stylesheet
	 * 
	 * @param  {string} stylesheet_name 
	 * @return {null}         
	 */
	function change_stylesheet(stylesheet_name) {
		$('#main_stylesheet').attr('href', BASE + '/bootstrap/css/' + stylesheet_name);
	}


	// Change the stylehseet on page load
	// if (typeof $.cookie('miles_chat_stylesheet') !== 'undefined') {
	if (CHAT.STORAGE.is_enabled()) {
		var new_stylesheet = CHAT.STORAGE.get('stylesheet');
		if (new_stylesheet) {
			change_stylesheet(new_stylesheet);
		}
	}
	// }

	// Get the selected stylesheet name, set the cookie, then change the stylesheet
	$('.change-theme').click(function(e) {
		e.preventDefault();
		var stylesheet_name = $(this).data('stylesheet');
		if (CHAT.STORAGE.is_enabled()) {
			CHAT.STORAGE.set('stylesheet', stylesheet_name);
		}
		change_stylesheet(stylesheet_name);
	});
});


/*
|--------------------------------------------------------------------------
| Localstorage
|--------------------------------------------------------------------------
| 
| Getting and setting values for localstorage
| 
*/
CHAT.STORAGE = {

	key_prefix: 'miles-chat_',

	/**
	 * Gets a value from storage
	 * @return object
	 */
	get: function( key ){

		if( typeof key === 'undefined')
			return false;

		key = this.key_prefix + key;

		try{
			return JSON.parse( localStorage.getItem( key ) );
		} catch(e){
			return false;
		}

	},

	/**
	 * Sets a value in storage
	 * @param string key
	 * @param mixed val
	 */
	set: function( key, val ){

		if( typeof key === 'undefined' || typeof val === 'undefined' )
			return false;

		key = this.key_prefix + key;

		try{

			localStorage.setItem( key, JSON.stringify( val ) );

			jQuery('body').trigger( 'grist_storage_change' );

			return true;

		} catch(e){
			return false;
		}

	},

	/**
	 * Does this browser support localStorage?
	 * @see - http://diveintohtml5.info/detect.html#storage
	 */
	is_enabled: function(){
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch(e){
			return false;
		}
	},

};