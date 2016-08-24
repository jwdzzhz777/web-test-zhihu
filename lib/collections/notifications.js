Notifications = new Mongo.Collection('notifications');

Notifications.allow({
	update: function(userId,doc,fieldNames){
		return 	ownsDocument(userId,doc) 	&& 
				fieldNames.length === 1 	&& 
				fieldNames[0] === 'read';		 
	}
});


creatCommentNotification = function(comment) {
	var post = Posts.findOne(comment.postId);
	if(post.userId !== comment.userId){
		Notifications.insert({
			userId: post.userId,
			postId: post._id,
			commentId: comment._id,
			commenter: comment.author,
			read: false
		});
	}
};