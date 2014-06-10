/** @jsx React.DOM */

var ChatDiv = React.createClass({
	// get messages from server
	// send message to server
	// poll for new messages
	// render the chat div HTML

	/**
	 * Render the chat-div, messages, and submit form
	 * @return {JSX} 
	 */
	render: function() {
		return (
			<div className="chat-div">
				<legend>Messages</legend>
				<ChatMessages />
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
		return (
			// Create all chat messages and store as an array called chatMessages
			<div className="chat-messages-div" id="chat_messages">{chatMessages}</div>
		);
	},
});

var ChatMessage = React.createClass({
	// builds the HMTL for a single message

	/**
	 * Render the individual chat message
	 * @return {JSX} 
	 */
	render: function() {
		return (
			<div className="chat-message panel panel-default">
				<div className="chat-message-info panel-heading">
					<span className='text-muted'>{username}</span> | {createdAt}
				</div>
				<div className="chat-message-body panel-body" data-messageid={messageId}>
					<p>{message}</p>
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

React.renderComponent(<ChatDiv />, document.getElementById('react_chat'));