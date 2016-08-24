Comments = new Mongo.Collection('comments');

Meteor.methods({
	commentInsert: function(commentAttributes) {
		check(this.userId, String);
		check(commentAttributes,{
			postId: String,
			body: String
		});

		var user = Meteor.user();
		var post = Posts.findOne(commentAttributes.postId);
		if(!post){
			return throwError('You must comment on a post');

		}
		comment = _.extend(commentAttributes,{
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			commentsCount: 0
		});


		comment._id = Comments.insert(comment);

		insertCommentCount(comment.postId);
		creatCommentNotification(comment);

		return comment._id;
	}
});
