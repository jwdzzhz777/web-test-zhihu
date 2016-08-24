Meteor.publish('posts',function(id) {
	check(id, String);
	return Posts.find(id);
});

Meteor.publish('post',function() {
	return Posts.find();
});

Meteor.publish('postss', function(options) {
	check(options, {
		sort: Object,
		limit: Number
	});
	return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
	check(id, String);
	return Posts.find(id);
});

Meteor.publish('comments',function(postId) {
	check(postId, String);
	return Comments.find({postId: postId});
});

Meteor.publish('topics',function() {
	return Topics.find();
});

Meteor.publish('topicsByName',function(topic) {
	check(topic, String);
	return Topics.find({topic: topic+""});
});

Meteor.publish('topicsById',function(id) {
	check(id, String);
	return Topics.find(id);
});


Meteor.publish('usertopics',function() {
	return UserTopics.find();
});

Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('icons',function() {
	return Icons.find();
});

Meteor.publish('images',function(){
	return Images.find();
});
