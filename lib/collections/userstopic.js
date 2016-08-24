UserTopics = new Mongo.Collection('usertopics');
//同时用户头像储存于此

Meteor.methods({
	topicInsert: function(usertopic) {
		check(this.userId, String);
		check(usertopic, {
			userId: String,
			topicId: String
		});

		var hadtopic = UserTopics.findOne({userId: usertopic.userId});
		if(hadtopic){
			var newtopic = UserTopics.update(
				{
					userId: usertopic.userId,
					topicId: {$ne: usertopic.topicId}////$ne 返回所有不包含该标签的项
				},
				{
					$addToSet: {topicId: usertopic.topicId}
				}
			);
			if(!newtopic){
				return {postExists: true};
			}
			return newtopic;
		}else{
			var post = {
				userId: usertopic.userId,
				topicId: [usertopic.topicId]
			}
			var topicIds = UserTopics.insert(post);
			return {_id: topicIds};
		}
	},
	topicRemove: function(usertopic) {
		check(this.userId, String);
		check(usertopic, {
			userId: String,
			topicId: String
		});

		var hadtopic = UserTopics.findOne({userId: usertopic.userId});
		if(hadtopic){
			var newtopic = UserTopics.update(
				{
					userId: usertopic.userId,
					topicId: usertopic.topicId
				},
				{
					$pull: {topicId: usertopic.topicId}
				}
			);
			if(!newtopic){
				return {postExists: true};
			}
			return newtopic;
		}
	},
	userIconInsert:function(usericon){
		check(this.userId, String);
		check(usericon, {
			userId: String,
			userIcon: String
		});
		var hadtopic = UserTopics.findOne({userId: usericon.userId});
		if(hadtopic){
			var newIcon = UserTopics.update({userId: usericon.userId},{$set: {userIcon: usericon.userIcon}});
			return newIcon;
		}
		if(!hadtopic){
			var topicIds = UserTopics.insert(usericon);
			return topicIds;
		}
	}
});
