$(document).ready(function() {

	/*
	|--------------------------------------------------------------------------
	| Setting stylesheets
	|--------------------------------------------------------------------------
	| 
	| Get and set stylesheets from cookies
	| 
	*/

	/**
	 * Append the given stylesheet to the head
	 * 
	 * @param  {string} stylesheet_name 
	 * @return {null}         
	 */
	function append_stylesheet(stylesheet_name) {
		$('head').append('<link rel="stylesheet" href="' + BASE + '/bootstrap/css/' + stylesheet_name + '" type="text/css" id="hc_stylesheet"/>');
	}


	if (typeof $.cookie('miles_chat_stylesheet') !== 'undefined') {
		append_stylesheet($.cookie('miles_chat_stylesheet'));
	}

	// Get the selected stylesheet name, set the cookie, then change the stylesheet
	$('.change-theme').click(function(e) {
		e.preventDefault();
		var stylesheet_name = $(this).data('stylesheet');
		$.cookie('miles_chat_stylesheet', stylesheet_name);
		append_stylesheet(stylesheet_name);
	});
});