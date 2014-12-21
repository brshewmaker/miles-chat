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
			if (data === 'false') { 
				window.location.href = BASE;
			}
			// if (data.error) { window.location.href = BASE; } //if user not authenticated, go home
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
