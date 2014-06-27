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

	/**
	 * Remove previous highlights and add a new highlight on the given them
	 * @param  {string} stylehseet 
	 */
	function highlight_current_theme(stylesheet) {
		$('li .active').removeClass('active');
		var $current = $("a[data-stylesheet*='" + stylesheet + "']").parent();
		$current.addClass('active');
	}


	// Change the stylehseet on page load
	if (CHAT.STORAGE.is_enabled()) {
		var new_stylesheet = CHAT.STORAGE.get('stylesheet');
		if (new_stylesheet) {
			change_stylesheet(new_stylesheet);
			highlight_current_theme(new_stylesheet);
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
		highlight_current_theme(stylesheet_name);
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

/*
|--------------------------------------------------------------------------
| UI Helpers
|--------------------------------------------------------------------------
| 
| Manipulate DOM elements, start plugins, etc
| 
*/
CHAT.HELPERS = {

	/**
	 * Scroll the chat messages div to the bottom and/or scroll the entire window to the bottom
	 * for the mobile users
	 */
	scrollChatDiv: function() {
		$('.chat-messages-div').scrollTop($('.chat-messages-div')[0].scrollHeight);
		$('html, body').scrollTop($(document).height());
	},

	/**
	 * Add or remove the server-error message div
	 * 
	 * @param  {string} toggle on or off
	 */
	toggleServerErrorMessage: function(toggle) {
		if (toggle == 'on' && !$('.chat-messages-div .alert-danger').length) {
			$('.chat-messages-div').append($('.server-error').html());
			$('.chat-textarea').addClass('has-error');
		}
		if (toggle == 'off') {
			$('.chat-messages-div .alert-danger').remove();
			$('.chat-textarea').removeClass('has-error');
		}
	},

	/**
	 * Determine if the user is at the bottom of the chat_message_div
	 * 
	 * @return {BOOL} 
	 */
	userAtBottomOfMessagesDiv: function() {
		var chat_messages = $('.chat-messages-div');
		if (chat_messages[0].scrollHeight - chat_messages.scrollTop() == chat_messages.outerHeight()) {
			return true;
		}
		return false;
	},

	/**
	 * Add a 'sending' div on a chat submit
	 */
	addSendingDiv: function() {
		$('.chat-messages-div').append($('#sending_msg_div').html());
	},

	/**
	 * Remove any 'sending' messages that were previously added
	 */
	removeSendingDiv: function() {
		$('.chat-messages-div').find('.sending-message').remove();
	},

	/**
	 * Appends (n) to the end of the title, where n is the number of messages received
	 * since the last focus.
	 */
	addTitleAlert: function() {
		if (!document.hasFocus()) {
			var title = document.title;
			var titleRegex = title.match(/\d+/);
			var numAlerts = titleRegex ? parseInt(titleRegex, 10) : 0;
			if (numAlerts === 0) {
				document.title = title + ' (1)';
			}
			else {
				numAlerts++;
				document.title = title.replace(/\([^\)]*\)/g, '(' + numAlerts + ')');
			}

			$(window).focus(function () {
				document.title = title.replace(/\([^\)]*\)/g, '');
			});
		}
	},

	/**
	 * Add new chat messages to array, removing any older messages
	 * if the total is > 19
	 * 
	 * @param  {array} currentState this.state.data
	 * @param  {array} newData     data from the server
	 * @return {array}             updated state 
	 */
	adjustChatMessagesArray: function(currentState, newData) {
		var numToRemove = 0;
		for (var message in newData) {
			currentState.push(newData[message]);
			numToRemove++;
		}
		if (currentState.length > 19) { currentState.splice(0, numToRemove); } //only remove items if there are at least 20 already
		return currentState;
	},

	/**
	 * Removes active class on previously active tab and adds active class on given section

	 * @param  {string} current 
	 */
	toggleActiveArchiveTab: function(current) {
		$('.nav').find('.active').removeClass('active');
		$('.archive-' + current).addClass('active');
	},

	/**
	 * Start the blockUI plugin with custom defaults to use baked-in Bootstrap styling.
	 * 
	 * @param {string} message Optional loading message to display
	 */
	addBlockUI: function(message) {
		message = typeof message !== 'undefined' ? message : 'Loading...';
		$.blockUI({
			message: '<h4>' + message + '</h4>',
			css: {
				padding:	'auto',
				margin:		'auto',
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'auto',
				border:		'auto',
				backgroundColor:'auto',
				cursor:		'wait'
			},
			overlayCSS:  {
				backgroundColor: '#000',
				opacity:         0,
				cursor:          'wait'
			},
			blockMsgClass: 'alert alert-info',
		});
	}
};