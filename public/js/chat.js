$(document).ready(function() {
	/*
	|--------------------------------------------------------------------------
	| Send a chat 
	|--------------------------------------------------------------------------
	| 
	| Use jqueryForm to to submit the chat message form
	| 
	*/
	$('#chat_box').ajaxForm({
		dataType: 'json',
		beforeSubmit: function() {
			$('#send_button').hide();
		},
		clearForm: true,
		success: function() {
			$('#send_button').show();
		}
	});

	$('.chat-messages').load(BASE+'/get-chat-messages/initial');

	/*
	|--------------------------------------------------------------------------
	| Get chat messages
	|--------------------------------------------------------------------------
	| 
	| Do a GET request to /get-chat-messages every 2 seconds to get
	| the latest chat messages
	| 
	*/

	function update_chat_messages() {
		var message_id = $('.chat-messages td:last').data('messageid');
		if (typeof message_id !== 'undefined') {
			$.get(BASE + '/get-chat-messages/newest/' + message_id, function(data) {
				$('.chat-messages').append(data);
			});
			setTimeout(update_chat_messages, 3000);
		}
		else { setTimeout(update_chat_messages, 2000); }
	}

	// Start the loop to check for chat messages
	setTimeout(update_chat_messages, 2000);

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