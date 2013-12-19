$(document).ready(function() {
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
});