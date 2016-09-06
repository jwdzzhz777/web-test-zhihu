//锟斤拷页锟斤拷
$(window).scroll(showMoreVisible);
function showMoreVisible() {
	var target = $('#showMoreResults');
	$scrollTopButton = $('#scrollTopButton');
	var scrollTopInt = $(window).scrollTop();
	if(	scrollTopInt >= SHOW_BUTTON_SCROLL	&&
		$scrollTopButton.is(":hidden")		&&
		!$scrollTopButton.is(":animated")
	){
		$scrollTopButton.fadeIn(500);
	}else if(	scrollTopInt <= SHOW_BUTTON_SCROLL	&&
				$scrollTopButton.is(":visible")		&&
				!$scrollTopButton.is(":animated")
			){
		$scrollTopButton.fadeOut(500);
	}
	if (!target.length) return;
	var name = Router.current().route.getName();
	var threshold = scrollTopInt + $(window).height() - target.height();
	if (target.offset().top < threshold) {
		Session.set(name,{
			limit: Session.get(name).limit + 5,
			sort: Session.get(name).sort
		});
		console.log('scroll result2: ', threshold+"||"+target.offset().top);
	}
};

scrollToTop = function(){
	$('html,body').animate({scrollTop: '0px'},800);
}

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
				//node锟斤拷锟斤拷要锟狡讹拷锟斤拷锟斤拷位锟矫碉拷DOM元锟斤拷
				//next锟斤拷node锟狡讹拷锟斤拷锟斤拷位锟斤拷之锟斤拷锟斤拷元锟斤拷
				var $node = $(node),$next = $(next);
				var oldTop = $node.offset().top;
				var height = $node.outerHeight(true);

				var $between = $node.nextUntil($next);
				if($between.length === 0){
					var $between = $next.nextUntil($node);
				}

				$node.insertBefore(next);

				var newTop = $node.offset().top;
				//锟斤拷锟矫匡拷
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
