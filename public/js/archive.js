
var Router = Backbone.Router.extend({
	routes : {
		""    : "index",
		"all" : "all",
		"date/:year/:month" : "date",
		"search" : "search"
	},

	index : function() {
		CHAT.HELPERS.toggleActiveArchiveTab('date');
		React.renderComponent(ArchiveIndex(null), document.getElementById('archive'));
	},

	date: function(year, month) {
		React.renderComponent(ArchiveDate({year: year, month: month}), document.getElementById('archive'));
	},

	all : function() {
		CHAT.HELPERS.toggleActiveArchiveTab('all');
		React.renderComponent(ArchiveAll(null), document.getElementById('archive'));
	},

	search: function() {
		CHAT.HELPERS.toggleActiveArchiveTab('search');
		React.renderComponent(ArchiveSearch(null), document.getElementById('archive'));
	},

});
 
new Router();
 
Backbone.history.start();
