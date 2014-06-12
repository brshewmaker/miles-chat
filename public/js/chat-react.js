/** @jsx React.DOM */

var CHAT = CHAT || {};
CHAT.HELPERS = {

	/**
	 * Scroll the chat messages div to the bottom and/or scroll the entire window to the bottom
	 * for the mobile users
	 */
	scrollChatDiv: function() {
		$('.chat-messages-div').scrollTop($('.chat-messages-div')[0].scrollHeight);
		$('html, body').scrollTop($(document).height());
	},

	/**
	 * Add or remove the server-error message div
	 * 
	 * @param  {string} toggle on or off
	 */
	toggleServerErrorMessage: function(toggle) {
		if (toggle == 'on' && !$('.chat-messages-div .alert-danger').length) {
			$('.chat-messages-div').append($('.server-error').html());
			$('.chat-textarea').addClass('has-error');
		}
		if (toggle == 'off') {
			$('.chat-messages-div .alert-danger').remove();
			$('.chat-textarea').removeClass('has-error');
		}
	},

	/**
	 * Determine if the user is at the bottom of the chat_message_div
	 * 
	 * @return {BOOL} 
	 */
	userAtBottomOfMessagesDiv: function() {
		var chat_messages = $('.chat-messages-div');
		if (chat_messages[0].scrollHeight - chat_messages.scrollTop() == chat_messages.outerHeight()) {
			return true;
		}
		return false;
	},

	/**
	 * Add a 'sending' div on a chat submit
	 */
	addSendingDiv: function() {
		$('.chat-messages-div').append($('#sending_msg_div').html());
	},

	/**
	 * Remove any 'sending' messages that were previously added
	 */
	removeSendingDiv: function() {
		$('.chat-messages-div').find('.sending-message').remove();
	},

	/**
	 * Given a username, flash the title until the user goes back to that window/tab,
	 * unless the user is already on that tab, then don't flash anything
	 * @param {string} username 
	 */
	addTitleAlert: function(username) {
		if (!document.hasFocus()) {
			var isNonAlert = true;
			var nonAlert = 'Chat';
			var alertTitle = 'Chat @' + username;
			var interval = null;
			interval = setInterval(function() {
			    document.title = isNonAlert ? nonAlert : alertTitle;
			    isNonAlert = !isNonAlert;
			}, 700);

			$(window).focus(function () {
			    clearInterval(interval);
			    $("title").text(nonAlert);
			});
		}
	},

	/**
	 * Add new chat messages to array, removing any older messages
	 * if the total is > 19
	 * 
	 * @param  {array} currentState this.state.data
	 * @param  {array} newData     data from the server
	 * @return {array}             updated state 
	 */
	adjustChatMessagesArray: function(currentState, newData) {
		var numToRemove = 0;
		for (var message in newData) {
			currentState.push(newData[message]);
			numToRemove++;
		}
		if (currentState.length > 19) { currentState.splice(0, numToRemove); } //only remove items if there are at least 20 already
		return currentState;
	}
};


var ChatDiv = React.createClass({

	getInitialState: function() {
		return {data: []};
	},

	componentWillMount: function() {
		this.getInitialChatMessages();
	},

	/**
	 * Get the last 20 chat messages from the server on page load, 
	 * then start the loop to get new messages
	 */
	getInitialChatMessages: function() {
		$.ajax({
			type: 'GET',
			url: BASE + '/get-chat-messages/initial',
			success: function(data) {
				this.setState({data: data});
				CHAT.HELPERS.scrollChatDiv();
				this.getNewChatMessages();
			}.bind(this)
		});
	},

	/**
	 * Uses long-polling to request any new messages from the server
	 */
	getNewChatMessages: function() {
		CHAT.HELPERS.toggleServerErrorMessage('off');
		var message_id = this.state.data[this.state.data.length-1].messageid;
		$.ajax({
			type: 'GET',
			url: BASE + '/get-chat-messages/newest/' + message_id,
			async: true,
			cache: false,
			timeout: 30000,
			success: this.addNewMessages,
			error: function() {
				CHAT.HELPERS.toggleServerErrorMessage('on');
				CHAT.HELPERS.scrollChatDiv();
				setTimeout(this.tryToReconnectOnError, 2000);
			}.bind(this)
		});
	},

	/**
	 * Handle what happens when the server returns data from an AJAX request
	 * @param {array} data  Data received from the server
	 */
	addNewMessages: function(data) {
		if (typeof data !== undefined && data.length > 0) {
			if (data.error) { window.location.href = BASE; } //if user not authenticated, go home

			this.setState({data: CHAT.HELPERS.adjustChatMessagesArray(this.state.data, data)});

			// DOM Manipulations after a new message comes in
			if (CHAT.HELPERS.userAtBottomOfMessagesDiv()) { CHAT.HELPERS.scrollChatDiv(); }
			CHAT.HELPERS.removeSendingDiv();
			CHAT.HELPERS.addTitleAlert(this.state.data[this.state.data.length-1].username);
		}
		this.getNewChatMessages();
	},

	/**
	 * Ping the server every 2 seconds until we can reconnect
	 */
	tryToReconnectOnError: function() {
		$.ajax({
			type: 'GET',
			url: BASE + '/get-logged-in-users', //url doesn't really matter here, just need to try to get a response
			async: true,
			cache: false,
			timeout: 2000,
			success: this.getNewChatMessages,
			error: function() {
				setTimeout(this.tryToReconnectOnError, 2000);
			}.bind(this)
		});
	},

	/**
	 * Render the chat-div, messages, and submit form
	 * @return {JSX} 
	 */
	render: function() {
		return (
			<div>
				<legend>Messages</legend>
				<ChatMessages data={this.state.data}/>
				<ChatForm />
			</div>
		);
	},
});

var ChatMessages = React.createClass({
	/**
	 * Render all chat messages and plop them into their correct div
	 * @return {JSX} 
	 */
	render: function() {
	    var messagesArray = this.props.data.map(function (message, index) {
			return <ChatMessage 
				key={message.messageid}
				username={message.username}
				timestamp={message.timestamp}
				message={message.message} >
				</ChatMessage>;
	    });
		return (
			<div className="chat-messages-div" id="chat_messages">{messagesArray}</div>
		);

		},
});

var ChatMessage = React.createClass({
	/**
	 * Render the individual chat message
	 *
	 * Cureently expects raw HTML to be send from the server for the message, so, for now, 
	 * trusting that the server will send back 'safe' HTML and inject that directly into the DOM
	 * @return {JSX} 
	 */
	render: function() {
		return (
			<div className="chat-message panel panel-default">
				<div className="chat-message-info panel-heading">
					<span className='text-muted'>{this.props.username}</span> | {this.props.timestamp}
				</div>
				<div className="chat-message-body panel-body">
					<p dangerouslySetInnerHTML={{__html: this.props.message}} />
				</div>
			</div>
		);
	}
});

var ChatForm = React.createClass({

	render: function() {
		return (
			<div className="chat-input">
				<form className="form-inline" id="chat_box" action="send_chat" method="post">
					<div className="form-group chat-textarea col-md-11 col-sm-10">
						<div className="controls">
							<textarea className="form-control" name="chatmsg" id="chatmsg"></textarea>
						</div>
					</div>

					<div className="form-group chat-help">
						<div className="controls">
					    	<button type="button" id="popover_btn" className="btn btn-default" data-container="body" data-toggle="popover" data-placement="top">?</button>
					    </div>
				    </div>
				</form>
			</div>
		);
	}
});

/*
|--------------------------------------------------------------------------
| Document Ready
|--------------------------------------------------------------------------
| 
| Start the React chain and handle file uploads
| 
*/

$(document).ready(function() {

	React.renderComponent(<ChatDiv />, document.getElementById('chat-div'));

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
			if (data.error) { window.location.href = BASE; } //if user not authenticated, go home
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
