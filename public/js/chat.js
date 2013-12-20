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
	setInterval(function() {
		var message_id = $('.chat-messages td:last').data('messageid');
		console.log(message_id);
		if (typeof message_id !== 'undefined') {
			console.log('attempting to load new chat messages');
			$.get(BASE + '/get-chat-messages/newest/' + message_id, function(data) {
				$('.chat-messages').append(data);
			});
		}
	}, 2000);
});