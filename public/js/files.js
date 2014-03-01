function remove_file_from_queue() {
	var file_id = $(this).data('fileid');
	var file_to_remove = uploader.getFile(file_id);
	uploader.removeFile(file_to_remove);
	$(this).parent().remove();
}


var uploader = new plupload.Uploader({
	browse_button: 'browse',
	url: BASE + '/upload-file'
});

uploader.init();

uploader.bind('FilesAdded', function(up, files) {
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

	$('.remove-upload').on('click', remove_file_from_queue);
});

uploader.bind('UploadProgress', function(up, file) {
	var $progress_div = $('div').find('[data-fileid="' + file.id + '"]');
	$progress_div.attr('style', 'width: ' + file.percent + '%');
	$progress_div.html(file.percent + '%');

});

// Remove all (remove) links from uploader files when the uploading starts
uploader.bind('UploadFile', function(uploader_object, file) {
	$('.remove-upload').remove();
});

uploader.bind('Error', function(up, err) {
	document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
});

document.getElementById('start-upload').onclick = function() {
	uploader.start();
};