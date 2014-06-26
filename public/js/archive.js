
var Router = Backbone.Router.extend({
  routes : {
    ""    : "index",
    "all" : "all",
    "date/:year/:month" : "date"
  },

  index : function() {
	$('.archive-all').removeClass('active');
	$('.archive-date').addClass('active');
	React.renderComponent(ArchiveIndex(null), document.getElementById('archive'));
  },

  date: function(year, month) {
	React.renderComponent(ArchiveDate({year: year, month: month}), document.getElementById('archive'));
  },

  all : function() {
	$('.archive-date').removeClass('active');
	$('.archive-all').addClass('active');
	React.renderComponent(ArchiveAll(null), document.getElementById('archive'));
  }
});
 
new Router();
 
Backbone.history.start();
