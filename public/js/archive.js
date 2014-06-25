
var Router = Backbone.Router.extend({
  routes : {
    ""    : "date",
    "all" : "all"
  },
  date : function() {
	$('.archive-all').removeClass('active');
	$('.archive-date').addClass('active');
	React.renderComponent(ArchiveIndex(null ), document.getElementById('archive'));
  },
  all : function() {
	$('.archive-date').removeClass('active');
	$('.archive-all').addClass('active');
	React.renderComponent(ArchiveDiv(null ), document.getElementById('archive'));
  }
});
 
new Router();
 
Backbone.history.start();
