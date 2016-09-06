Posts = new Mongo.Collection('posts');

//客户端调用insert等方法时需要用到allow/deny
Posts.allow({
	//只允许登陆用户添加
	insert: function(userId,doc){
		return !! userId;
	},
	update: function(userId,doc){
		return !! userId;
	}
});

insertCommentCount = function(id){
	Posts.update(id, {$inc: {commentsCount: 1}});
}

//在postSubmit中
validatePost = function (post) {
	var errors = {};
	if (!post.title)
		errors.title = "请填写 title";
	if (!post.topic)
		errors.topic =  "请填写 topic";
	if(post.body.length === 0)
		errors.body =  "请填写 body";
	return errors;
}

//内置方法时不需要allow/deny
Meteor.methods({
	//postAttributes是call方法里传进来的post
	postInsert:function(postAttributes) {
		check(this.userId,String);
		check(postAttributes, {
			title: String,
			body: String,
			topic: String,
			bodyWithoutImage: String,
			usedImageId: Array
		});

		var errors = validatePost(postAttributes);
		if (errors.title || errors.body || errors.topic)
			throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL 以及话题");

		var postWithSameTitle = Posts.findOne({title: postAttributes.title});
		if(postWithSameTitle){
			return {postExists:true,_id:postWithSameTitle._id};
		}

		var user = Meteor.user();
		//_.extend() 方法来自于 Underscore 库，作用是将一个对象的属性传递给另一个对象。
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			commentsCount: 0,
			upvoters: [],
			votes: 0
		});

		var postId = Posts.insert(post);

		return {_id:postId};
	},
	updatePosts:function(updatePosts){
		check(this.userId,String);
		check(updatePosts,{
			id: String,
			body: String,
			bodyWithoutImage: String,
			usedImageId: Array
		});

		var newPosts = Posts.update(
			updatePosts.id,
			{
				$set: {
					body: updatePosts.body,
					bodyWithoutImage: updatePosts.bodyWithoutImage,
					usedImageId: updatePosts.usedImageId
				}
			}
		);
		return newPosts;
	},
	upvote: function(postId) {
		check(this.userId, String);
		check(postId, String);

		var affected = Posts.update({
			_id:postId,
			upvoters:{
				$ne: this.userId //$ne 返回所有不包含该标签的项
			}
		},{
			$addToSet: {upvoters: this.userId},
			$inc: {votes: 1}
		});

		if (!affected){
			throwError("You weren't able to upvote that post")
		}
	}
});
