Template.postTopic.helpers({
	noTopic: function() {
		var user = Meteor.user();
		var has = UserTopics.findOne({userId: user._id});
		if(!has){
			return true;
		}
		if(!has.topicId){return true;}
			return !!has.topicId[0]? false: true;
	},
	guanzhu: function() {
		var user = Meteor.user();
		var isExists = false;
		var usertopic = UserTopics.findOne({userId: user._id});
		if(!usertopic){
			return isExists;
		}
		var topicid = this;
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
	topics: function() {
		return Topics.find();
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
	}
});

Template.postTopic.events({
	//注意:选择器通过id只能选择到第一个id相符的元素,这里之所以能绑定所有的因为实质是.on()方法,然后用到了事件代理。所有事件由模板(大概)代理。
	'click #guanzhu':function() {
		var user = Meteor.user();
		var isExists = false;
		var usertopic = {
			userId: user._id,
			topicId: this._id
		}
		var usertopics = UserTopics.findOne({userId: usertopic.userId});
		if(!usertopics){
			return isExists;
		}
		var topicid = this;
		$(usertopics.topicId).each(function(index,element) {
			if(element === usertopic.topicId){
				isExists = true;
			}
		});
		if(isExists){
			Meteor.call('topicRemove', usertopic, function(error,result) {
				if(error){
					return throwError(error.reason);
				}
				
				if(result.postExists){
					throwError('话题并没有关注');
				}
			});
		}else{
			Meteor.call('topicInsert', usertopic, function(error,result) {
				if(error){
					return throwError(error.reason);
				}
				
				if(result.postExists){
					throwError('话题已关注');
					return Router.go('postTopic', {_id: result._id});
				}
				
				Router.go('postTopic');
			});	
		}	
	},
	'click #best': function(){
		name = Router.current().route.getName();
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
		name = Router.current().route.getName();
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
	'click #topostTopic': function(){
		var name = Router.current().route.getName();
		Session.set(name, {
			limit: 5,
			sort: getSortFrom.newsort
		});
		console.log('Session result: ', Session.get(name));
	},
});

Template.postTopic.onRendered(function() {
	if(this.find('#topicicon')){
		this.find('#topicicon')._uihooks = {
			insertElement: function(node,next) {
				$(node).animate({
					top: 10,
					opacity:0
				},0);
				$(node).animate({
					top: 0,
					opacity:1
				});
				$(node).insertBefore(next);
			},
			removeElement: function(node) {
				$(node).fadeOut(150,function() {
					$(this).remove();
				});
			}
		}
	}
});

var getSortFrom = {
	bestsort: {votes: -1, submitted: -1, _id: -1},
	newsort: {submitted: -1, _id: -1}
}