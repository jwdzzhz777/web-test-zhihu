Template.head1.helpers({
	usericon: function() {
		var user = Meteor.user();
		var icon = UserTopics.findOne({userId: user._id,userIcon: {$exists:true}});
		if(icon){
			var image = Icons.findOne(icon.userIcon);
			if(image){
				return image.url({store: 'small'});
			}
		}else{
			return "/t404.jpg";
		}
	},
	activeRouteClass: function(name) {
		if(Router.current() && Router.current().route.getName() === name){
			return 'active';
		}
  }
});