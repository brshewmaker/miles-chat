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
		this.getMessages(10, 1);
	},

	/**
	 * Do a GET request to get messages and pagination info based on number of results per page
	 * and the current page Number.  
	 *
	 * Also uses the blockUI plugin to let the user know something is happening.

	 * @param  {int} perPage How many restults per page
	 * @param  {int} pageNum What Page are we on?
	 */
	getMessages: function(perPage, pageNum) {
		$.blockUI({ 
			message: '<h3>Loading...</h3>',
		    overlayCSS:  { 
		        backgroundColor: '#000', 
		        opacity:         0, 
		        cursor:          'wait' 
		    }, 
			css: { 
				border: 'none', 
				padding: '15px', 
				backgroundColor: '#000', 
				'-webkit-border-radius': '10px', 
				'-moz-border-radius': '10px', 
				opacity: .5, 
				color: '#fff' 
			} 
		}); 

		$.ajax({
			type: 'GET',
			url: BASE + '/archive/all/' + perPage + '/' + pageNum,
			success: function(data) {
				$.unblockUI();
				this.setState({
					messages: data.messages,
					pagination: {
						perPage: perPage,
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
				<ArchiveForm handleClick={this.getMessages} pageNum={this.state.pagination.pageNum} />
				<ChatMessages data={this.state.messages} />
				<ArchivePagination handleClick={this.getMessages} pagination={this.state.pagination}/>
			</div>
		);
	},
});

var ArchiveForm = React.createClass({
	/**
	 * Call getMessages again with the given number of results per page, starting on page 1
	 * @param  {Object} event React.js event object
	 */
	onChange: function(event) {
		var numResults = event.target.value;
		this.props.handleClick(numResults, 1);
	},

	render: function() {
		return (
			<form onChange={this.onChange} className="form-inline padding-bottom-20" role="form">
				<div className="form-group">
					<label for="select" className="padding-right-10">Number of results per page: </label>
					<select className="form-control">
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50</option>
					</select>
				</div>
			</form>
		);
	}
});

var ArchivePagination = React.createClass({

	/**
	 * Handle the click for the first and last links
	 * @param  {Object} event 
	 */
	onClick: function(event) {
		event.preventDefault();
		var pageNum = event.currentTarget.getAttribute('data-page');
		this.props.handleClick(this.props.pagination.perPage, pageNum);		
	},

	/**
	 * Build an array of the nearest page numbers given the current page
	 * and the total number of pages
	 * 
	 * @return {array} 
	 */
	processPaginationLinks: function() {
		var currentLinks = [];
		var x = parseInt(this.props.pagination.pageNum);
		var y = parseInt(this.props.pagination.numPages);

		if (x <= 2) {
			for (var i = 1; i <= (y > 5 ? 5 : y); i++) {
				currentLinks.push(i);
			};
			if (y > 5) currentLinks.push(y);
		}
		else if ( x + 2 <= y) {
			if (x > 3) currentLinks.push(1);
			for (var i = x - 2; i <= x + 2; i++) {
				currentLinks.push(i);
			}
			if (x + 2 < y) currentLinks.push(y);
		}
		else if (x + 2 > y) {
			if (x > 3) currentLinks.push(1);
			for (var i = (y - 4 < 1 ? 1 : y - 4); i <= y; i++) {
				currentLinks.push(i);
			}		
		}
		return currentLinks;
	},

	/**
	 * Builds an array of <li> elements for the nearest pagination pages as well as 
	 * appending/prepending first/last links as well.
	 * @return {JSX} 
	 */
	render: function() {
		var linksArray = this.processPaginationLinks();
		var paginationLinks = linksArray.map(function(link, index) {
			return  <ArchivePaginationLi
						key={index}
						currentLink={link}
						pagination={this.props.pagination}
						handleClick={this.props.handleClick}>
					</ArchivePaginationLi>;
		}.bind(this));
		return (
			<div className="archive-pagination">
				<ul className="pagination">
					<li><a onClick={this.onClick} data-page={this.props.pagination.pageNum == 1 ? '1' : parseInt(this.props.pagination.pageNum, 10) - 1} href="#">«</a></li>
					{paginationLinks}
					<li><a onClick={this.onClick} data-page={this.props.pagination.pageNum == this.props.pagination.numPages ? this.props.pagination.numPages : parseInt(this.props.pagination.pageNum, 10) + 1} href="#">»</a></li>
				</ul>
			</div>
		);
	}
});

var ArchivePaginationLi = React.createClass({

	/**
	 * Handle click event for a pagination link
	 * @param  {Object} event 
	 */
	onClick: function(event) {
		event.preventDefault();
		this.props.handleClick(this.props.pagination.perPage, this.props.currentLink);
	},

	render: function() {
		return (
			<li className={this.props.currentLink == this.props.pagination.pageNum ? 'active' : ''}>
				<a onClick={this.onClick} href="#">{this.props.currentLink}</a>
			</li>
		);
	}
});




