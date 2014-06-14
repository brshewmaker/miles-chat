/** @jsx React.DOM */

// var ArchiveDiv = React.createClass({
// 	render: function() {
// 		return (
// 			<div>
// 				<ChatMessages data={this.state.data} />
// 				<ArchivePagination />
// 			</div>
// 		);
// 	},
// }),

// var ArchivePaginationLinks = React.createClass({
// 	render: function() {
// 		return (
// 			<div className="pagination">
// 				<ul>{paginationLinks}</ul>
// 			</div>
// 		);
// 	}
// }),
var ChatDiv = React.createClass({displayName: 'ChatDiv',

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
			React.DOM.div(null, 
				React.DOM.legend(null, "Messages"),
				ChatMessages( {data:this.state.data}),
				ChatForm(null )
			)
		);
	},
});

var ChatMessages = React.createClass({displayName: 'ChatMessages',
	/**
	 * Render all chat messages and plop them into their correct div
	 * @return {JSX} 
	 */
	render: function() {
	    var messagesArray = this.props.data.map(function (message, index) {
			return ChatMessage( 
				{key:message.messageid,
				username:message.username,
				timestamp:message.timestamp,
				message:message.message} 
				);
	    });
		return (
			React.DOM.div( {className:"chat-messages-div", id:"chat_messages"}, messagesArray)
		);

		},
});

var ChatMessage = React.createClass({displayName: 'ChatMessage',
	/**
	 * Render the individual chat message
	 *
	 * Cureently expects raw HTML to be send from the server for the message, so, for now, 
	 * trusting that the server will send back 'safe' HTML and inject that directly into the DOM
	 * @return {JSX} 
	 */
	render: function() {
		return (
			React.DOM.div( {className:"chat-message panel panel-default"}, 
				React.DOM.div( {className:"chat-message-info panel-heading"}, 
					React.DOM.span( {className:"text-muted"}, this.props.username), " | ", this.props.timestamp
				),
				React.DOM.div( {className:"chat-message-body panel-body"}, 
					React.DOM.p( {dangerouslySetInnerHTML:{__html: this.props.message}} )
				)
			)
		);
	}
});

var ChatForm = React.createClass({displayName: 'ChatForm',

	render: function() {
		return (
			React.DOM.div( {className:"chat-input"}, 
				React.DOM.form( {className:"form-inline", id:"chat_box", action:"send_chat", method:"post"}, 
					React.DOM.div( {className:"form-group chat-textarea col-md-11 col-sm-10"}, 
						React.DOM.div( {className:"controls"}, 
							React.DOM.textarea( {className:"form-control", name:"chatmsg", id:"chatmsg"})
						)
					),

					React.DOM.div( {className:"form-group chat-help"}, 
						React.DOM.div( {className:"controls"}, 
					    	React.DOM.button( {type:"button", id:"popover_btn", className:"btn btn-default", 'data-container':"body", 'data-toggle':"popover", 'data-placement':"top"}, "?")
					    )
				    )
				)
			)
		);
	}
});