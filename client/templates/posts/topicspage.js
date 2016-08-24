Template.topicsPage.onRendered(function() {
	this.find('.leftbox')._uihooks = {
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
		moveElement:function(node,next){
			//node是需要移动到新位置的DOM元素
			//next是node移动到新位置之后的元素
			var $node = $(node),$next = $(next);
			var oldTop = $node.offset().top;
			var height = $node.outerHeight(true);
			
			var $between = $node.nextUntil($next);
			if($between.length === 0){
				var $between = $next.nextUntil($node);
			}
			
			$node.insertBefore(next);
			
			var newTop = $node.offset().top;
			//不好看
			$node
				.removeClass('animate')
				.css('top', oldTop - newTop);
			
			$between
				.removeClass('animate')
				.css('top',oldTop<newTop ? height : -1 * height);
			
			$node.offset();
			
			$node.addClass('animate').css('top', 0);
			$between.addClass('animate').css('top', 0);
		}
	}
});

Template.topicsPage.helpers({
	guanzhu: function() {
		var user = Meteor.user();
		var isExists = false;
		var usertopic = UserTopics.findOne({userId: user._id});
		if(!usertopic){
			return isExists;
		}
		var topicid = this._id;
		$(usertopic.topicId).each(function(index,element) {
			if(element === topicid){
				isExists = true;
			}
		})
		if(isExists){
			return "取消关注";
		}else{
			return "关注";
		}
	}
})

Template.topicsPage.events({
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
				
			});
		}
		
	}
});