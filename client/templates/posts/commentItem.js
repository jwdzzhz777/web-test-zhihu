Template.commentItem.onRendered(function(){
	//虽然不知道原理this.$('#')依旧不能取到
	//this.$('.')却可以正确地取到当前
	//大概是选择父布局为this的吧
	this.$('.commentBody').append(this.data.body);
});

Template.commentItem.helpers({
	submittedText: function() {
		return this.submitted.toString();
	},
	usericon: function() {
		var icon = UserTopics.findOne({
				userId: this.userId,
				userIcon: {$exists:true}
			});
		if(icon){
			var icons = Icons.findOne(icon.userIcon)
			return icons.url({store: 'small'});
		}else{
			return "/t404.jpg";
		}
	}
});
