//��ҳ��
$(window).scroll(showMoreVisible);
function showMoreVisible() {
	var target = $('#showMoreResults');
		if (!target.length) return;
		var name = Router.current().route.getName();
		var threshold = $(window).scrollTop() + $(window).height() - target.height();
		if (target.offset().top < threshold) {
			Session.set(name,{
				limit: Session.get(name).limit + 5,
				sort: Session.get(name).sort
			});
			console.log('scroll result: ', threshold+"||"+target.offset().top);
		}
};

Template.postsList.onRendered(function() {
	if(this.find('.wrapper')){
		this.find('.wrapper')._uihooks = {
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
				//node����Ҫ�ƶ�����λ�õ�DOMԪ��
				//next��node�ƶ�����λ��֮����Ԫ��
				var $node = $(node),$next = $(next);
				var oldTop = $node.offset().top;
				var height = $node.outerHeight(true);

				var $between = $node.nextUntil($next);
				if($between.length === 0){
					var $between = $next.nextUntil($node);
				}

				$node.insertBefore(next);

				var newTop = $node.offset().top;
				//���ÿ�
				$node
					.removeClass('animate')
					.css('top', oldTop - newTop);

				$between
					.removeClass('animate')
					.css('top',oldTop<newTop ? height : -1 * height);

				$node.offset();

				$node.addClass('animate').css('top', 0);
				$between.addClass('animate').css('top', 0);
			},
			removeElement: function(node) {
				$(node).fadeOut(150,function() {
					$(this).remove();
				});
			}
		}
	}
});

Template.postList.helpers({
	usericon: function() {
		var user = Meteor.user();
		var icon = UserTopics.findOne({userId: user._id,userIcon: {$exists:true}});
		if(icon){
			var icons = Icons.findOne(icon.userIcon)
			return icons.url({store: 'middle'});
		}else{
			return "/t404.jpg";
		}
	}
});
