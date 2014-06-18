/** @jsx React.DOM */

var ArchiveDiv = React.createClass({displayName: 'ArchiveDiv',
	getInitialState: function() {
		return {
			messages: [],
			pagination: []
		};
	},

	componentWillMount: function() {
		this.getMessages(20, 1);
	},

	/**
	 * Do a GET request to get messages and pagination info based on number of results per page
	 * and the current page Number

	 * @param  {int} perPage How many restults per page
	 * @param  {int} pageNum What Page are we on?
	 */
	getMessages: function(perPage, pageNum) {
		$.ajax({
			type: 'GET',
			url: BASE + '/archive/all/' + perPage + '/' + pageNum,
			success: function(data) {
				this.setState({
					messages: data.messages,
					pagination: {
						numPages: data.numPages,
						pageNum: pageNum
					}
				});
			}.bind(this)
		});
	},

	render: function() {
		return (
			React.DOM.div(null, 
				ChatMessages( {data:this.state.messages} ),
				ArchivePagination( {pagination:this.state.pagination})
			)
		);
	},
});

var ArchivePagination = React.createClass({displayName: 'ArchivePagination',

	/**
	 * Build an array of the nearest page numbers given the current page
	 * and the total number of pages
	 * 
	 * @return {array} 
	 */
	processPaginationLinks: function() {
		var currentLinks = [];
		var x = this.props.pagination.pageNum;
		var y = this.props.pagination.numPages

		if (x - 2 < 0 && y < 5) {
			for (var i = 1; i <= y; i++) {
				currentLinks.push(i);
			};
		}
		else if ( x - 2 > 0 && x + 2 < y) {
			for (var i = x - 2; i <= x + 2; i++) {
				currentLinks.push[i];
			}
		}
		else if (x - 2 > 0 && x + 2 > y) {
			for (var i = x - 2; i <= y; i++) {
				currentLinks.push[i];
			}		
		}

		return currentLinks;
	},

	render: function() {
		var linksArray = this.processPaginationLinks();
		console.log(linksArray);
		var paginationLinks = linksArray.map(function(link, index) {
			return  ArchivePaginationLi(
						{key:index,
						currentLink:link,
						currentPage:this.props.pagination.pageNum}
					);
		}.bind(this));
		return (
			React.DOM.div( {className:"archive-pagination"}, 
				React.DOM.ul( {className:"pagination"}, 
					React.DOM.li(null, React.DOM.a( {href:"#"}, "«")),
					paginationLinks,
					React.DOM.li(null, React.DOM.a( {href:"#"}, "»"))
				)
			)
		);
	}
});

var ArchivePaginationLi = React.createClass({displayName: 'ArchivePaginationLi',
	render: function() {
		return (
			React.DOM.li( {className:this.props.currentLink == this.props.currentPage ? 'active' : ''}, 
				React.DOM.a( {href:"#"}, this.props.currentLink)
			)
		);
	}
});





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