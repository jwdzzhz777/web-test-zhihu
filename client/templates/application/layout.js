dialogOption = {
	autoOpen: false,
	height:300,
	width:500,
	dialogClass: "no-title",
	show: {
		effect: "fade",
		duration: 100
	},
	hide: {
		effect: "fade",
		duration: 200
	},
	modal: true
}

Template.postSubmit.onCreated(function() {
	Session.set('fileObj', null);
});

//根据窗口大小改变dialog的大小。
$(window).resize(function(){
	$('#imgBox').dialog('option','height',$(window).height());
});

Template.layout.onRendered(function() {
	//动画
	this.find('#main')._uihooks = {
		insertElement: function(node, next) {
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
	};

	//弹窗初始化
	$('#iconProgressDialog').dialog(dialogOption);
	$('#imageProgressDialog').dialog(dialogOption);
	$('#imgBox').dialog({
		autoOpen: false,
		height: $(window).height(),
		width:'100%',
		resizable : false,//不可改变大小
		draggable: false,//不可拖动
		dialogClass: "no-content",
		open: function(event,ui){
			$('body').css({'overflow-y':'hidden'});
		},
		beforeClose: function(event,ui){
			$('body').css({'overflow-y':'scroll'});
		},
		show: {
			effect: "fade",
			duration: 100
		},
		hide: {
			effect: "fade",
			duration: 200
		},
		modal: true
	});
	//回到顶部按钮
	$('#scrollTopButton').hide();
});

Template.layout.events({
	'click #scrollTopButton': function(e){
		scrollToTop();
	}
});
