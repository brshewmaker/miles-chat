var uploader = new plupload.Uploader({
	browse_button: 'browse',
	url: BASE + '/upload-file'
});

uploader.init();

// Fires after files were filtered and added to the queue
uploader.bind('FilesAdded', function(up, files) {
	console.log('FilesAdded called');
	var html = '';
	plupload.each(files, function(file) {
		html += '<tr><td>' + file.name + '</td><td colspan="4">'
			+ '<div class="progress">'
			+ '    <div data-fileid="' + file.id + '" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">'
			+ '	   </div>'
			+ '</div>'
			+ '</td>'
			+ '<td><button class="btn btn-danger">x</button></td></tr>';
	});
	console.log(html);
	$('#files_table').append(html);
});



uploader.bind('UploadProgress', function(up, file) {
	var divvy = $('div').find('[data-fileid="' + file.id + '"]');
	divvy.attr('style', 'width: ' + file.percent + '%');



	// document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
});

uploader.bind('Error', function(up, err) {
	document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
});

document.getElementById('start-upload').onclick = function() {
	uploader.start();
};