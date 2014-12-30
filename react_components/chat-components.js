var ChatDiv = React.createClass({

	userName: '',
	userID: 0,
	lastMessageID: 0,
	messagesPending: 0,

	getInitialState: function() {
		return {
			messages: []
		};
	},

	/**
	 * Get the first messages from the server, and get the auth username and id
	 */
	componentWillMount: function() {
		this.getInitialChatMessages();
		$.ajax({
			type: 'GET',
			url: BASE + '/get-user-info',
			success: function(user_info) {
				this.userName = user_info.username;
				this.userID = user_info.id;
			}.bind(this)
		});
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
				this.setState({messages: data});
				this.lastMessageID = this.state.messages[this.state.messages.length-1].messageid;
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
		$.ajax({
			type: 'GET',
			url: BASE + '/get-chat-messages/newest/' + this.lastMessageID,
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
			this.lastMessageID = data[data.length-1].messageid;
			this.setState({messages: this.adjustChatMessagesArray(this.state.messages, data)});

			// DOM Manipulations after a new message comes in
			if (CHAT.HELPERS.userAtBottomOfMessagesDiv()) { CHAT.HELPERS.scrollChatDiv(); }
			CHAT.HELPERS.removeSendingDiv();
			CHAT.HELPERS.addTitleAlert();
		}
		this.getNewChatMessages();
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
		for (var messageIndex in newData) {
			if (newData[messageIndex].username === this.userName && this.messagesPending > 0) {
				this.messagesPending--;
			}
			else{
				currentState.push(newData[messageIndex]);
				numToRemove++;
			}
		}
		if (currentState.length > 19) { currentState.splice(0, numToRemove); } //only remove items if there are at least 20 already
		return currentState;
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
	 * Event handler for when the user submits a new chat message
	 */
	insertNewMessage: function() {
		var message = $('#chatmsg').val();
		if (message === '') return;
		$('#chatmsg').val('');

		newMessageID = this.userName + '-' + (this.lastMessageID + 1);
		this.setState({messages: this.buildNewMessage(message, this.state.messages, newMessageID)});
		this.messagesPending++;
		CHAT.HELPERS.scrollChatDiv();

		$.ajax({
			type: 'POST',
			url: BASE + '/send_chat',
			data: {chatmsg: message},
			success: function(data) {
				this.updatePendingMessage(data, newMessageID);
			}.bind(this)
		});
	},

	/**
	 * Build a new message object and push it to the copied state
	 * 
	 * @param  {string} message  Submitted chat message
	 * @param  {Array} messages Array of message objects
	 * @return {Array}          New State to be set
	 */
	buildNewMessage: function(message, messages, message_id) {
		var newMessage = {
			message: message,
			messageid: message_id,
			timestamp: Date.now(),
			username: this.userName,
		};
		messages.push(newMessage);
		return messages;
	},


	updatePendingMessage: function(serverData, pendingID) {
		var $message = $('#' + pendingID);
		if (serverData) {
			$message.find('.chat-message-body-html').html(serverData.message);
		}
	},


	/**
	 * Render the chat-div, messages, and submit form
	 * @return {JSX} 
	 */
	render: function() {
		return (
			<div>
				<legend>Messages</legend>
				<ChatMessages messages={this.state.messages}/>
				<ChatForm onSubmit={this.insertNewMessage} />
			</div>
		);
	},
});

var ChatMessages = React.createClass({

	/**
	 * Use the commonMark markdown parser to parse the given message
	 * 
	 * @param  {string} message Message from the DB
	 * @return {string}         Parsed message
	 */
	renderCommonMark: function(message) {
		var reader = new commonmark.DocParser();
		var writer = new commonmark.HtmlRenderer();
		var parsed = reader.parse(message);
		return writer.render(parsed);
	},

	/**
	 * Render all chat messages and plop them into their correct div
	 * @return {JSX} 
	 */
	render: function() {
	    var messagesArray = this.props.messages.map(function (message, index) {
			return <ChatMessage 
				key={message.messageid}
				username={message.username}
				timestamp={CHAT.TIME.formatTime(message.timestamp)}
				message={this.renderCommonMark(message.message)} 
				messageid={message.messageid} >
				</ChatMessage>;
	    }.bind(this));
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
			<div className="chat-message panel panel-default" id={this.props.messageid}>
				<div className="chat-message-info panel-heading">
					<span className='text-muted'>{this.props.username}</span> | {this.props.timestamp}
				</div>
				<div className="chat-message-body panel-body">
					<div className="chat-message-body-html" dangerouslySetInnerHTML={{__html: this.props.message}} />
				</div>
			</div>
		);
	}
});

var ChatForm = React.createClass({

	/**
	 * Add listener for the enter key in the chat message form
	 */
	componentDidMount: function() {
		$('#chatmsg').on('keydown', function(e) {
			if (e.which == 13 && ! e.shiftKey) {
				e.preventDefault();
				this.props.onSubmit();
			}
		}.bind(this));
	},

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

