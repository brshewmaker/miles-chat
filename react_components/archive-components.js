

var ArchiveDiv = React.createClass({
	getInitialState: function() {
		return {
			messages: [],
			pagination: []
		};
	},

	componentWillMount: function() {
		this.getMessages(20, 1);
	},

	getMessages: function(perPage, pageNum) {
		$.ajax({
			type: 'GET',
			url: BASE + '/archive/all/' + perPage + '/' + pageNum,
			success: function(data) {
				this.setState({
					messages: data.messages,
					pagination: {
						totalMessages: data.totalMessages,
						numPages: data.numPages,
						pageNum: pageNum
					}
				});
			}.bind(this)
		});
	},

	render: function() {
		return (
			<div>
				<ChatMessages data={this.state.messages} />
				<ArchivePagination />
			</div>
		);
	},
});

var ArchivePagination = React.createClass({
	render: function() {
		return (
			<div className="pagination">
				<ul>pagination</ul>
			</div>
		);
	}
});