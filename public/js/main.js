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
	 * Append the given stylesheet to the head
	 * 
	 * @param  {string} stylesheet_name 
	 * @return {null}         
	 */
	function append_stylesheet(stylesheet_name) {
		$('head').append('<link rel="stylesheet" href="' + BASE + '/bootstrap/css/' + stylesheet_name + '" type="text/css" id="hc_stylesheet"/>');
	}


	if (typeof $.cookie('miles_chat_stylesheet') !== 'undefined') {
		append_stylesheet($.cookie('miles_chat_stylesheet'));
	}

	// Get the selected stylesheet name, set the cookie, then change the stylesheet
	$('.change-theme').click(function(e) {
		e.preventDefault();
		var stylesheet_name = $(this).data('stylesheet');
		$.cookie('miles_chat_stylesheet', stylesheet_name);
		append_stylesheet(stylesheet_name);
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
	is_enabled: (function(){
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch(e){
			return false;
		}
	})()

};