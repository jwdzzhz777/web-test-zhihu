Template.postsItem.onRendered(function(){
	//
});


Template.postsItem.helpers({
	upvotedClass: function() {
		var userId = Meteor.userId();
		if(userId && !_.include(this.upvoters, userId)) {
			return 'btn-primary upvotable';
		}else{
			return 'disabled';
		}
	},
	topicc: function(id) {
		var topic = Topics.findOne(id);
		return topic.topic;
	},
	topicId: function(){
		var atopic = new Array();
		/*$(this.topicId).each(function(index,element) {
			var topic = Topics.findOne(element);
			atopic[index] = topic;
		});*/
		var topic = Topics.findOne(this.topic);
		atopic[0] = topic;
		return atopic;
	},
	topiccc: function() {
		var topics = Topics.findOne(this.topic);
		return topics.topic;
	},
	usericon: function() {
		var icon = UserTopics.findOne({userId: this.userId,userIcon: {$exists:true}});
		if(icon){
			var icons = Icons.findOne(icon.userIcon)
			return icons.url({store: 'middle'});
		}else{
			return "/t404.jpg";
		}
	},
	hasImg: function(){
		if(this.usedImageId.length === 0){
			return false;
		}else{
			return true;
		}
	},
	firstImg: function(){
		var id = this.usedImageId;
		var image = Images.findOne(id[0]);
		if(image){
			return image.url();
		}
	}
});

Template.postsItem.events({
	'click .upvotable': function(e) {
		e.preventDefault();
		Meteor.call('upvote', this._id);
	},
	//尝试使用自定义事件,将summernote()的行为放在了.summernote自身上
	//放弃使用这种方法
	/*'change:summernote .summernote': function(e){
		e.preventDefault();
		$(e.target).summernote('code',this.body);
		$(e.target).summernote('destroy');
	},
	'click .clicksummernote': function(e,instance){
		e.preventDefault();
		$(e.target).closest('.summernote').trigger('change:summernote');
	}*/
	'click .clicksummernote': function(e,instance){
		e.preventDefault();
		$(e.target).parent().append(this.body);
		$(e.target).detach();
	}
});
