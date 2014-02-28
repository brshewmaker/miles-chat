var uploader = new plupload.Uploader({
	browse_button: 'browse',
	url: BASE + '/upload-file'
});

uploader.init();

uploader.bind('FilesAdded', function(up, files) {
	var html = '';
	plupload.each(files, function(file) {
		html += ''+
			'<li><span>' + file.name + ' | ' + plupload.formatSize(file.size) + ' | </span><a class="remove-upload" href="#">(remove)</a>' +
				'<div class="progress">' +
					'<div data-fileid="' + file.id + '" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
				'</div>' +
			'</li>';
	});
	$('#upload_message').hide();
	$('#filelist').append(html);
});


uploader.bind('UploadProgress', function(up, file) {
	var progress_div = $('div').find('[data-fileid="' + file.id + '"]');
	console.log(progress_div.html());
	progress_div.attr('style', 'width: ' + file.percent + '%');
});


uploader.bind('Error', function(up, err) {
	document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
});

document.getElementById('start-upload').onclick = function() {
	uploader.start();
};