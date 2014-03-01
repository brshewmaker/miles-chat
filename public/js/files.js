/*
|--------------------------------------------------------------------------
| pluploader 
|--------------------------------------------------------------------------
| 
| Create the pluploader object, call init(), then bind appropriate events
| 
*/

// Create the pluploader object with settings
var uploader = new plupload.Uploader({
	browse_button: 'browse',
	url: BASE + '/upload-file',
	drop_element: 'file_upload_div',
});

uploader.init();

uploader.bind('FilesAdded', add_files_to_queue);

uploader.bind('UploadProgress', add_file_upload_progress);

// Remove all (remove) links from uploader files when the uploading starts
uploader.bind('UploadFile', function(uploader_object, file) {
	$('.remove-upload').remove();
});

// Redirect when file uploading is done
uploader.bind('UploadComplete', function() {
	window.location.replace(BASE + '/files');
});

// Error handling
uploader.bind('Error', function(up, err) {
	$('#error_console').show();
	document.getElementById('error_console').innerHTML += "\nError #" + err.code + ": " + err.message;
});

// Start uploading
document.getElementById('start-upload').onclick = function() {
	uploader.start();
};


/*
|--------------------------------------------------------------------------
| Callback functions
|--------------------------------------------------------------------------
| 
| These are more complex callback function used with the pluploader object
| 
*/


/**
 * Remove the file from the queue when user clicks on the (remove) linke
 */
function remove_file_from_queue() {
	var file_id = $(this).data('fileid');
	var file_to_remove = uploader.getFile(file_id);
	uploader.removeFile(file_to_remove);
	$(this).parent().remove();
}

/**
 * Callback function for 'FilesAdded' listener
 *
 * Loops through each of the files and adds the appropriate HTML to the DOM. 
 * Also, adds a listener for the (remove) link
 * 
 * @param {object} up    Uploader Object
 * @param {array} files  Files queue array
 */
function add_files_to_queue(up, files) {
	var html = '';
	plupload.each(files, function(file) {
		html += ''+
			'<li><span>' + file.name + ' | ' + plupload.formatSize(file.size) + ' | </span><a data-fileid="' + file.id + '"class="remove-upload" href="#">(remove)</a>' +
				'<div class="progress">' +
					'<div data-fileid="' + file.id + '" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
				'</div>' +
			'</li>';
	});
	$('#upload_message').hide();
	$('#filelist').append(html);

	// Create listener
	$('.remove-upload').on('click', remove_file_from_queue);
}

/**
 * Callback to update the % done for a given file
 * 
 * @param {object} up   Uploader object
 * @param {object} file File currently being uploaded
 */
function add_file_upload_progress(up, file) {
	var $progress_div = $('div').find('[data-fileid="' + file.id + '"]');
	$progress_div.attr('style', 'width: ' + file.percent + '%');
	$progress_div.html(file.percent + '%');
}







