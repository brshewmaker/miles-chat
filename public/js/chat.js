$(document).ready(function() {
	// Insert a message
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

	// Update chat messages
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
});