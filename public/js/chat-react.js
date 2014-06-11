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
};


var ChatDiv = React.createClass({

	getInitialState: function() {
		return {data: []};
	},

	componentWillMount: function() {
		this.getInitialChatMessages();
	},

	/**
	 * Get the last 20 chat messages from the server on page load
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

	getNewChatMessages: function() {
		CHAT.HELPERS.toggleServerErrorMessage('off');
		var message_id = this.state.data[this.state.data.length-1].messageid;
		console.log('latest message is: ' + message_id);
		if (typeof message_id !== 'undefined') {
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
		}
		else { setTimeout(this.getNewChatMessages, 2000); }
	},

	addNewMessages: function(data, status, xhr) {
		if (typeof data !== undefined && data.length > 0) {
			var newState = this.state.data;
			var numToRemove = 0;
			for (var message in data) {
				newState.push(data[message]);
				numToRemove++;
			}
			newState.splice(0, numToRemove);
			this.setState({data: newState});
			if (CHAT.HELPERS.userAtBottomOfMessagesDiv()) { CHAT.HELPERS.scrollChatDiv(); }
		}
		this.getNewChatMessages();
	},

	tryToReconnectOnError: function() {
		// remove_sending_div();
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

React.renderComponent(<ChatDiv />, document.getElementById('chat-div'));