
uploadImageId = [];
usedImageId = [];

//找出哪些上传了但是没用到的图片
witchIsNotUsed = function(uploadImageId,usedImageId){
	var notUsed = [];
	$.each(uploadImageId ,function(index,element){
		var id = element;
		var isUsed = false;
		$.each(usedImageId,function(index,element){
			if(id === element){
				isUsed = true;
			}
		});
		if(!isUsed){
			notUsed.push(id);
		}
	});
	return notUsed;
}

//删除那些没用到的图片
deleteWitchNotUsed = function(notused) {
	$.each(notused,function(index,element){
		Images.remove(element);
	});
	uploadImageId = [];
	usedImageId = [];
}
//editor 属性
getNode = function(){
	//自定义button
	var deleatebutton = function (context) {
		var ui = $.summernote.ui;
		// create button
		var button = ui.button({
			contents: '<i class="fa fa-child"/> delete',
			tooltip: 'myRemoveMedia',
			click: function(){
				/*if(Session.get('fileObjId')){
					var id = Session.get('fileObjId');
					console.log('file result: ', id);
					Images.remove(id);
					Session.set('fileObjId',null);
				}*/
				//源码，和默认没区别
				context.invoke('editor.removeMedia');
			}
        });

		return button.render();   // return button as jquery object
	};
	//属性
	var node = {
		height: 200,
		minHeight: 200,
		maxHeight: 500,
		placeholder: 'write here...',
		dialogsInBody: true,//让dialog在<body>中（大概）解决了dialog布局奇奇怪怪的问题。
		toolbar: [
			// [groupName, [list of button]]
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['height', ['height']],
			['picture',['picture']]
		],
		popover: {
			image: [
				['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
				['float', ['floatLeft', 'floatRight', 'floatNone']],
				['remove', ['myRemoveMedia']]
			]
		},
		buttons:{
			'myRemoveMedia': deleatebutton
		},
		callbacks: {
			//自定义图片上传
			onImageUpload : function(files) {
				// get current editable container
				if(Session.get('fileObjId')){
					Session.set('fileObjId',null);
				}else{
					Session.setDefault('fileObjId');
				}

				var dialog = $('#imageProgressDialog');
				dialog.dialog('open');

				var $note = $(this);
				// use summernote api
				Images.insert(files[0], function (err, fileObj) {
					// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
					if(err){
						throwError(err);
					}
					Session.set('fileObjId',fileObj);
					uploadImageId.push(fileObj._id);
				});
				Meteor.startup(function(){
					Tracker.autorun(function() {
						if(image = Session.get('fileObjId')){
							id = image._id;
							if(image.hasStored('images')){
								$note.summernote('insertImage', image.url(),function ($image) {
									$image.attr('class', 'imageUp');
									$image.attr('width', '100%');
									$image.attr('height', '100%');
									$image.attr('id',id);
								});
								dialog.dialog('close');
								sAlert.success('上传已完成',{timeout: 2000,effect:'jelly'});
								Session.set('fileObjId',null);
                            }
						}
					});
				});
			}
		}
	};
	return node;
}
