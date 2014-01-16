/**
 * Removes the first n table rows where n = total number of table rows - 20
 * 
 * @return {null} 
 */
function remove_old_chat_messages() {
	var num_messages_to_remove = $('.chat-messages tr').length - 20;
	while (num_messages_to_remove > 0) {
		$('.chat-messages').find('tr:first').remove();
		num_messages_to_remove--;
	}
}

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
			$('#chat_box').resetForm();
		},
		clearForm: true,
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
		// Scroll to bottom of chat content when the content is loaded
		$('.chat-messages-div').scrollTop($('.chat-messages-div')[0].scrollHeight);
	});

	function update_chat_messages() {
		var message_id = $('.chat-messages td:last').data('messageid');
		if (typeof message_id !== 'undefined') {
			$.get(BASE + '/get-chat-messages/newest/' + message_id, function(data) {
				$('.chat-messages').append(data);
				remove_old_chat_messages();
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