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

			jQuery('body').trigger( 'miles_chat_storage_change' );

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
	 * Use the commonMark markdown parser to parse the given message
	 * 
	 * @param  {string} message Message from the DB
	 * @return {string}         Parsed message
	 */
	renderCommonMark: function(message) {
		var reader = new commonmark.DocParser();
		var writer = new commonmark.HtmlRenderer();
		var parsed = reader.parse(message);
		return writer.render(parsed);
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
	 * Start the blockUI plugin with custom defaults to use baked-in Bootstrap styling.  If an element is pass in
	 * call blockUI only on that element instead of the entire page
	 * 
	 * @param {string} message Optional loading message to display
	 * @param {string} element Apply block UI only on this element
	 */
	addBlockUI: function(message, element) {
		message = typeof message !== 'undefined' ? message : 'Loading...';
		var options = {
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
		};
		if (typeof element !== 'undefined') {
			$(element).block(options);
		}
		else {
			$.blockUI(options);
		}
	}
};

CHAT.TIME = {

	/**
	 * Given a unix timestamp, format it for use in Miles Chat.
	 * 
	 * @param  {int} timestamp Unix timestamp
	 * @return {string}           Formatted stirng: 12:10pm Mon, Dec. 27 2014
	 */
	formatTime: function(timestamp) {
		var date = this.convertFromUTC(timestamp);
		var timeString = this.amOrPM(date.getHours(), date.getMinutes());
		var dow = this.dayOfWeekAsString(date.getDay());
		var dom = date.getDate();
		var month = this.monthOfYearAsString(date.getMonth());
		var year = date.getFullYear();

		return timeString + ' ' + dow + ', ' + month + ' ' + dom + ' ' + year;
	},

	/**
	 * Convert the server timestamp (which is UTC) to the local time for the user
	 * 
	 * @param  {int} timestamp Server Timestamp
	 * @return {Date}           Date object with correct time zone
	 */
	convertFromUTC: function(timestamp) {
		var offset = new Date().getTimezoneOffset();
		return new Date(timestamp * 1000 + offset);
	},

	/**
	 * Given hour and minutes, return a formatted string with AM or PM at the end
	 * 
	 * @param  {int} hour    24 hour time
	 * @param  {int} minutes minutes
	 * @return {string}         Formatted time string
	 */
	amOrPM: function(hour, minutes) {
		if (minutes < 10) minutes = '0' + minutes;
		if (hour > 12) {
			hour = hour - 12;
			return hour + ':' + minutes + ' PM';
		}
		return hour + ':' + minutes + ' AM';
	},

	/**
	* Converts a day number to a string.
	*
	* @param {number} dayIndex
	* @return {Number} Returns day as number
	*/
	dayOfWeekAsString: function(dayIndex) {
		return ["Mon","Tues","Wed","Ths","Fri","Sat","Sun"][dayIndex];
	},

	/**
	 * Converts a month number to a string 
	 * 
	 * @param  {int} monthIndex 0-11
	 * @return {string}            Month of year abbreviation
	 */
	monthOfYearAsString: function(monthIndex) {
		return ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][monthIndex];
	},

};




