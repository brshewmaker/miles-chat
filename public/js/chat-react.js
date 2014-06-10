/** @jsx React.DOM */

var ChatDiv = React.createClass({
	// get messages from server
	// send message to server
	// poll for new messages
	// render the chat div HTML
	getInitialChatMessages: function() {
		console.log('getInitialChatMessages');
		$.ajax({
			type: 'GET',
			url: BASE + '/get-chat-messages/initial',
			success: function(data) {
				console.log('worked');
				this.setState({data: data});
			}.bind(this)
		});
	},

	getInitialState: function() {
		return {data: []};
	},

	componentWillMount: function() {
		console.log('componentWillMount');
		this.getInitialChatMessages();
	},

	/**
	 * Render the chat-div, messages, and submit form
	 * @return {JSX} 
	 */
	render: function() {
		console.log('time to render');
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
	// When 'called', either grab the HTML or build it and return it in render
	// calls ChatMessage to get the HTML for an individual message

	/**
	 * Render all chat messages and plop them into their correct div
	 * @return {JSX} 
	 */
	render: function() {
	    var messagesArray = this.props.data.map(function (message, index) {
			return <ChatMessage 
				messageID={message.messageid}
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
	// builds the HMTL for a single message

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
				<div className="chat-message-body panel-body" data-messageid={this.props.messageID}>
					<p dangerouslySetInnerHTML={{__html: this.props.message}} />
				</div>
			</div>
		);
	}
});

var ChatForm = React.createClass({
	// Handle submitting the form
	// render the form HTML

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