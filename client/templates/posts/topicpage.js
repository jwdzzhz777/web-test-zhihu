Template.topicPage.helpers({
	guanzhu: function() {
		var user = Meteor.user();
		var isExists = false;
		var usertopic = UserTopics.findOne({userId: user._id});
		if(!usertopic){
			return isExists;
		}
		var topicid = this.topic._id;
		$(usertopic.topicId).each(function(index,element) {
			if(element === topicid){
				isExists = true;
			}
		})
		if(isExists){
			return '取消关注';
		}else{
			return '关注';
		}
	},
	bestdisable: function() {
		var name = Router.current().route.getName();
		if(Session.get(name).sort.votes){
			return 'disabled';
		}else{
			return '';
		}
	},
	newdisable: function() {
		var name = Router.current().route.getName();
		if(!Session.get(name).sort.votes){
			return 'disabled';
		}else{
			return;
		}
	},
	//暂时作弊的标签peopleCounts;实际应为follow
	likescount:function() {
		if(this.topic.peopleCounts){
			return this.topic.peopleCounts;
		}
	},
	parentTopics: function() {
		var topics = [];
		$(this.topic.parentTopic).each(function(index,element) {
			topics[index] = Topics.findOne(element);
		});
		return topics;
	},
	childTopics: function() {
		var topics = [];
		$(this.topic.childTopic).each(function(index,element) {
			topics[index] = Topics.findOne(element);
		});
		return topics;
	}
	
});

Template.topicPage.events({
	'click #guanzhu': function(e) {
		var user = Meteor.user();
		var isExists = false;
		var usertopic = {
			userId: user._id,
			topicId: this.topic._id
		}
		var usertopics = UserTopics.findOne({userId: usertopic.userId});
		if(!usertopics){
			return isExists;
		}
		$(usertopics.topicId).each(function(index,element) {
			if(element === usertopic.topicId){
				isExists = true;
			}
		})
		if(isExists){
			Meteor.call('topicRemove', usertopic, function(error,result) {
				if(error){
					throwError(error.reason);
				}
				if(result.postExists){
					throwError("话题并没有关注");
				}
			});
		}else{
			Meteor.call('topicInsert', usertopic, function(error,result) {
				if(error){
					throwError(error.reason);
				}
				if(result.postExists) {
					throwError("话题已经关注");
				}
			});
		}
	},
	'click #best': function(){
		var name = Router.current().route.getName();
		if(Session.get(name).sort.votes){
			return;
		}else{
			Session.set(name, {
				limit: Session.get(name).limit,
				sort: getSortFrom.bestsort
			});
		}
		console.log('Session result: ', Session.get(name));
	},
	'click #new': function(){
		var name = Router.current().route.getName();
		if(!Session.get(name).sort.votes){
			return;
		}else{
			Session.set(name, {
				limit: Session.get(name).limit,
				sort: getSortFrom.newsort
			});
		}
		console.log('Session result: ', Session.get(name));
	},
});

var getSortFrom = {
	bestsort: {votes: -1, submitted: -1, _id: -1},
	newsort: {submitted: -1, _id: -1}
}