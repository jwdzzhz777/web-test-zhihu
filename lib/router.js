Router.configure({
	layoutTemplate:'layout',
	loadingTemplate: 'loading',
	notFoundTemplate:'notfound',
	waitOn: function() {
		return [
		Meteor.subscribe('post'),
		Meteor.subscribe('usertopics'),
		Meteor.subscribe('notifications'),
		Meteor.subscribe('icons'),
		Meteor.subscribe('topics'),
		Meteor.subscribe('images')
		]
	}
});
//主要管分页与排序
LimitSortController = RouteController.extend({
	itemsLimit:function() {
		//可以用path
		if(!Session.get(this.template)){
			Session.setDefault(this.template,{limit:5,sort:{submitted: -1, _id: -1}});
		}
		return Session.get(this.template);
	},
	findOptions:	function() {return {sort: this.itemsLimit().sort, limit: this.itemsLimit().limit};},
	subscriptions: 	function() {
		this.postsSub = Meteor.subscribe('postss',this.findOptions());
	}
});

Router.route('/topic:topic?',{name: 'postTopic'});
	/*waitOn:function(){return [Meteor.subscribe('topics')]},
	data: function() {
		var forReturn = {};
		var topics = this.params.topic;
		//posts
		var sometopic = Topics.findOne({topic: topics+""});
		//topicd
		var user = Meteor.user();
		if(!user)	{return;}

		var usertopic = UserTopics.findOne({userId: user._id});
		if(!usertopic || !usertopic.topicId)	{return;}

		var topicarray = new Array();
		$(usertopic.topicId).each(function (index,element){
			var itopic = Topics.findOne(element);
			if(!sometopic && index === 0){
				itopic = _.extend(itopic ,{isactive: "active"});
			}
			if(sometopic && element === sometopic._id){
				itopic = _.extend(itopic ,{
					isactive: "active"
				})
			}
			topicarray[index] = itopic;
		})

		forReturn = _.extend(forReturn, {topicd: topicarray});

		if(sometopic){
			forReturn = _.extend(forReturn, {
				posts: Posts.find({topic: sometopic._id}),
				topicfirst: [sometopic]
			});
		}else{
			var topic = Topics.findOne(usertopic.topicId[0]);
			if(topic){
				forReturn = _.extend(forReturn, {
					posts: Posts.find({topic: topic._id}),
					topicfirst: [topic]
				});
			}
		}
		return forReturn;
	}*/
PostTopicController = LimitSortController.extend({
	template: 'postTopic',
	user:  			function() {return Meteor.userId();},
	sometopic: 		function() {
		var topic = Topics.findOne({topic: this.params.topic+""});
		if(!topic){return;}
		if(UserTopics.findOne({
			userId: this.user(),
			topicId: {$ne : topic._id}
			})){
				return;
			}
		return topic;
	},
	usertopic: 		function() {return UserTopics.findOne({userId: this.user()});},
	getusertopic: 	function() {
		var forReturn = {};
		var sometopic = this.sometopic();
		/*$(this.usertopic().topicId).each(function (index,element){
			var itopic = Topics.findOne(element);
			itopic = _.extend(itopic ,{isactive: ""});
			if(!sometopic && index === 0){
				itopic.isactive = "active";
			}
			if(sometopic && element === sometopic._id){
				itopic.isactive = "active";
			}
			topicarray[index] = itopic;
		})*/
		//更好的方法
		var topicarray = $.map(this.usertopic().topicId, function(element,index){
			var itopic = Topics.findOne(element);
			itopic = _.extend(itopic ,{isactive: ""});
			if(!sometopic && index === 0){
				itopic.isactive = "active";
			}
			if(sometopic && element === sometopic._id){
				itopic.isactive = "active";
			}
			return itopic;
		});
		forReturn = _.extend(forReturn, {topicd: topicarray});

		if(sometopic){
			forReturn = _.extend(forReturn, {
				posts: Posts.find({topic: sometopic._id},this.findOptions()),
				topicfirst: sometopic
			});
		}else{
			var topic = Topics.findOne(this.usertopic().topicId[0]);
			if(topic){
				forReturn = _.extend(forReturn, {
					posts: Posts.find({topic: topic._id},this.findOptions()),
					topicfirst: topic
				});
			}
		}
		return forReturn;
	},
	data: function() {
		if(!this.user())									{return;}
		if(!this.usertopic() || !this.usertopic().topicId)	{return;}

		var result = this.getusertopic();
		var hasMore = !(result.posts.count() < this.itemsLimit().limit);
		result = _.extend(result,{
			ready: this.postsSub.ready,
			nextPath: hasMore
		});
		return result;
	}
});

Router.route('/publictopics/:topic?',{
	name: 'topicsPage',
	data: function(){
		var topics = Topics.find({peopleCounts: {$gte: 1000000}});//***find()返回的对象是游标，遍历用forEach(function(element,index))***
		var topic = Topics.findOne({topic: this.params.topic+""});
		var sometopics = [];
		if(topic){
			var topicId = topic._id;
			sometopics[0] = topic;
		}
		var forReturn;
		if(topics){
			var isactive,topicarray = [];
			topics.forEach(function (element, index){
				isactive = "";
				if(topic && element.topic === topic.topic){
					isactive = "active";

				}
				if(!topic && index === 0){
					isactive = "active";
					topicId = element._id;
					sometopics[0] = element;
				}
				topicarray[index] = {topic:element ,isactive: isactive};
			})
			forReturn = {topics: topicarray,topic: topic};
		}
		//为了把自身加进去
		var sometopic = Topics.find({parentTopic: topicId});
		sometopic.forEach(function (element, index){
				sometopics[index + 1] = element;
			})
		forReturn = _.extend(forReturn,{sometopic: sometopics});
	return forReturn;
	}
});


Router.route('/posts/:_id', {
	name: 'postsPage',
	waitOn:function(){
		return [
			Meteor.subscribe('singlePost',this.params._id),
			Meteor.subscribe('comments',this.params._id)
		];
	},
	data: function(){
		return Posts.findOne(this.params._id);
	}
});

Router.route('/topic/:_id', {name: 'topicPage'});
TopicPageController = LimitSortController.extend({
	template: 'topicPage',
	waitOn: 		function() {return [Meteor.subscribe('topicsById',this.params._id)]},
	topic: 			function() {return Topics.findOne(this.params._id)},
	posts: 			function() {
		return Posts.find({topic: this.params._id},this.findOptions());
	},
	data: function() {
		var hasMore = !(this.posts().count() < this.itemsLimit().limit);
		return {
			topic: this.topic(),
			posts: this.posts(),
			ready: this.postsSub.ready,
			nextPath: hasMore
		};
	}
});

Router.route('/people/',{name: 'userPage'});
UserPageController = LimitSortController.extend({
	template: 'userPage',
	user: function() {return Meteor.user();},
	posts: function() {return Posts.find({userId: this.user()._id}, this.findOptions());},
	data: function() {
		if(!this.user()){return;}
		var hasMore = !(this.posts().count() < this.itemsLimit().limit);
		var user = Meteor.user();
		return {
			posts: this.posts(),
			ready: this.postsSub.ready,
			user: this.user(),
			nextPath: hasMore
		};
	}
});

Router.route('/submit', {
	name:'postSubmit'
});

Router.route('/', {name: 'postList'});
PostListController = LimitSortController.extend({
	template: 'postList',
	posts: function() {return Posts.find({}, this.findOptions());},
	data: function() {
		var hasMore = !(this.posts().count() < this.itemsLimit().limit);
		return {
			posts: this.posts(),
			ready: this.postsSub.ready,
			nextPath: hasMore
		};
	}
});

var requireLogin = function() {
	if(!Meteor.user()) {
		this.render('accessDenied');
	}else{
		this.next();
	}
}

Router.onBeforeAction(requireLogin);
Router.onBeforeAction('dataNotFound',{only: 'postsPage'});
