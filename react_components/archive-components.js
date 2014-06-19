var ArchiveDiv = React.createClass({
	getInitialState: function() {
		return {
			messages: [],
			pagination: []
		};
	},

	/**
	 * Start the archive page by grabbing the first 20 messages.  Hard-coding in
	 * the number per page for now.
	 */
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
					},
				});
			}.bind(this)
		});
	},

	render: function() {
		return (
			<div>
				<ChatMessages data={this.state.messages} />
				<ArchivePagination handleClick={this.getMessages} pagination={this.state.pagination}/>
			</div>
		);
	},
});

var ArchivePagination = React.createClass({

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

		if (x - 2 <= 0 && y < 5) {
			for (var i = 1; i <= y; i++) {
				currentLinks.push(i);
			};
		}
		else if ( x - 2 > 0 && x + 2 <= y) {
			for (var i = x - 2; i <= x + 2; i++) {
				currentLinks.push(i);
			}
		}
		else if (x - 2 > 0 && x + 2 > y) {
			for (var i = x - 2; i <= y; i++) {
				currentLinks.push(i);
			}		
		}
		return currentLinks;
	},

	render: function() {
		var linksArray = this.processPaginationLinks();
		var paginationLinks = linksArray.map(function(link, index) {
			return  <ArchivePaginationLi
						key={index}
						currentLink={link}
						currentPage={this.props.pagination.pageNum}
						numPages={this.props.pagination.numPages}
						handleClick={this.props.handleClick}>
					</ArchivePaginationLi>;
		}.bind(this));
		return (
			<div className="archive-pagination">
				<ul className="pagination">{paginationLinks}</ul>
			</div>
		);
	}
});

var ArchivePaginationLi = React.createClass({

	onClick: function(event) {
		event.preventDefault();
		this.props.handleClick(20, this.props.currentLink);
	},

	render: function() {
		return (
			<li className={this.props.currentLink == this.props.currentPage ? 'active' : ''}>
				{this.props.currentLink == 1 ? 
					<a onClick={this.onClick} href="#">«</a>
				: null}
				<a onClick={this.onClick} href="#">{this.props.currentLink}</a>
				{this.props.currentLink == this.props.numPages ? 
					<a onClick={this.onClick} href="#">»</a>
				: null}
			</li>
		);
	}
});




