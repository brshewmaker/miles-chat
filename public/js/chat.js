var CHAT = CHAT || {};
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
			var titleRegex = document.title.match(/\d+/);
			var numAlerts = titleRegex ? parseInt(titleRegex) : 0;
			if (numAlerts === 0) {
				document.title = 'Miles Chat: Chat (1)';
			}
			else {
				numAlerts++;
				document.title = 'Miles Chat: Chat (' + numAlerts + ')';
			}

			$(window).focus(function () {
				document.title = 'Miles Chat: Chat';
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
	}
};




/*
|--------------------------------------------------------------------------
| Document Ready
|--------------------------------------------------------------------------
| 
| Start the React chain and handle file uploads
| 
*/

$(document).ready(function() {

	React.renderComponent(ChatDiv(null ), document.getElementById('chat-div'));

	/* = Chat commands popover
	-------------------------------------------------------------- */
	$('#popover_btn').popover({
		title: 'Chat Commands',
		html: true,
		content: $('#chat_commands').html(),
	});


	/* = Send a chat message
	-------------------------------------------------------------- */
	var ajaxFormOptions = {
		dataType: 'json',
		beforeSubmit: function() {
			$('#chat_box').resetForm();
			CHAT.HELPERS.addSendingDiv();
			CHAT.HELPERS.scrollChatDiv();
		},
		clearForm: true,
	};

	$('#chat_box').ajaxForm(ajaxFormOptions);

	// Submit the chat input form on enter
	$('#chatmsg').on('keydown', function(e) {
		if (e.which == 13 && ! e.shiftKey) {
			e.preventDefault();
			$('#chat_box').ajaxSubmit(ajaxFormOptions);
		}
	});

	/* = Get logged in users
	-------------------------------------------------------------- */
	$('#logged_in_users').load(BASE + '/get-logged-in-users');
	setInterval(function() {
		$('#logged_in_users').load(BASE + '/get-logged-in-users', function(data, status, xhr) {
			if (data.error) { window.location.href = BASE; } //if user not authenticated, go home
		});
	}, 10000);

	/*
	|--------------------------------------------------------------------------
	| File Uploads
	|--------------------------------------------------------------------------
	| 
	| Use plupload to allow file uploading by dragging into the chat window
	| 
	*/

	var uploader = new plupload.Uploader({
		browse_button: 'hidden_button',
		url: BASE + '/upload-file',
		drop_element: 'chat_messages',
	});

	uploader.init();

	// TODO: Make this DRY!!  It is repeated in files.js!  Bad Ben!!
	uploader.bind('UploadProgress', function(up, file) {
		var $progress_div = $('div').find('[data-fileid="' + file.id + '"]');
		$progress_div.attr('style', 'width: ' + file.percent + '%');
		$progress_div.html(file.percent + '%');
	});

	uploader.bind('UploadComplete', function() {
		$('.file-upload p').remove();
		$('.file-upload').removeClass('shown').addClass('hidden');
		$('.sidebar').removeClass('uploading');
	});

	uploader.bind('FilesAdded', function(up, files) {
		$('.file-upload').removeClass('hidden').addClass('shown');
		$('.sidebar').addClass('uploading');

		var html = '';
		plupload.each(files, function(file) {
			html += ''+
				'<p><span>' + file.name + '</span>' +
					'<div class="progress">' +
						'<div data-fileid="' + file.id + '" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
					'</div>' +
				'</p>';
		});
		$('.file-upload').append(html);
		uploader.start();
	});
}); //end document.ready
