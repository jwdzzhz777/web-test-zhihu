Template.postSubmit.onCreated(function() {
	Session.set('fileObj', null);
});

Template.layout.onRendered(function() {
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
	}
	$('#iconProgressDialog').dialog({
		autoOpen: false,
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
	$('#imageProgressDialog').dialog({
		autoOpen: false,
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
});

Template.layout.helpers({
	selectedImageId: function(){
		if(fileObj = Session.get('fileObjId')){
			return fileObj._id;
		}else{
			return null;
		}
	},
	selectedIconId: function(){
		if(fileObj = Session.get('fileObIconjId')){
			return fileObj._id;
		}else{
			return null;
		}
	}
});
