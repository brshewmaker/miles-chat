/**
 * Removes the first n table rows where n = total number of table rows - 20
 * 
 * @return {null} 
 */
function remove_old_chat_messages() {
	var num_messages_to_remove = $('.chat-message').length - 20;
	while (num_messages_to_remove > 0) {
		$('.chat-messages-div').find('div:first').remove();
		num_messages_to_remove--;
	}
}

/**
 * Scroll the chat messages div to the bottom and/or scroll the entire window to the bottom
 * for the mobile users
 * 
 * @return {void} 
 */
function scroll_chat_messages_div() {
	$('.chat-messages-div').scrollTop($('.chat-messages-div')[0].scrollHeight);
	$('html, body').scrollTop($(document).height());
}


$(document).ready(function() {

	// Chat commands popover
	$('#popover_btn').popover({
		title: 'Chat Commands',
		html: true,
		content: $('#chat_commands').html(),
	});

	/*
	|--------------------------------------------------------------------------
	| Send a chat 
	|--------------------------------------------------------------------------
	| 
	| Use jqueryForm to to submit the chat message form
	| 
	*/

	var ajaxFormOptions = {
		dataType: 'json',
		beforeSubmit: function() {
			$('#chat_box').resetForm();
		},
		clearForm: true,
		success: function() {
			scroll_chat_messages_div();
		}
	};

	// Prepare the form for the submit button
	$('#chat_box').ajaxForm(ajaxFormOptions);

	// Submit the chat input form on enter
	$('#chatmsg').on('keydown', function(e) {
		if (e.which == 13 && ! e.shiftKey) {
			e.preventDefault();
			$('#chat_box').ajaxSubmit(ajaxFormOptions);
		}
	});


	/*
	|--------------------------------------------------------------------------
	| Get chat messages
	|--------------------------------------------------------------------------
	| 
	| Do a GET request to /get-chat-messages every 2 seconds to get
	| the latest chat messages
	| 
	*/
	$('.chat-messages-div').load(BASE+'/get-chat-messages/initial', function() {
		scroll_chat_messages_div();
	});

	function update_chat_messages() {
		var message_id = $('.chat-message-body:last').data('messageid');
		if (typeof message_id !== 'undefined') {
			$.ajax({
				type: 'GET',
				url: BASE + '/get-chat-messages/newest/' + message_id,
				async: true,
				cache: false,
				timeout: 30000,
				success: function(data) {
					if (data !== '') {
						$('.chat-messages-div').append(data);
						remove_old_chat_messages();
						update_chat_messages();
					}
				},
				error: function() {
					update_chat_messages();
				}
			});
		}
		else { setTimeout(update_chat_messages, 2000); }
	}

	// Start the loop to check for chat messages
	update_chat_messages();

	/*
	|--------------------------------------------------------------------------
	| Get logged in users
	|--------------------------------------------------------------------------
	| 
	| Do a GET request to /get-logged-in-users to get the currently logged
	| in users
	| 
	*/
	$('#logged_in_users').load(BASE + '/get-logged-in-users');
	setInterval(function() {
		$('#logged_in_users').load(BASE + '/get-logged-in-users');
	}, 30000);

});