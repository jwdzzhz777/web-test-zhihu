Meteor.startup(function(){
    $(window).bind('beforeunload', function() {
        deleteWitchNotUsed(witchIsNotUsed(uploadImageId,usedImageId));
        // have to return null, unless you want a chrome popup alert
		var ed;
        return ed;
		//return null 依旧会弹出alert，不return任何东西似乎可以,但会报错,而随便给一个null的对象有时候不会报错
        //return 'Are you sure you want to leave your Vonvo?';
    });
});
//下拉菜单不出来是因为有多个包含bootstrap的包，留一个就好。

Template.commentSubmit.onCreated(function() {});

Template.commentSubmit.onRendered(function() {
	this.$('.summernote').summernote(getNode());
});

Template.commentSubmit.onDestroyed(function(){
	deleteWitchNotUsed(witchIsNotUsed(uploadImageId,usedImageId));
});

Template.commentSubmit.helpers({});

Template.commentSubmit.events({
	'click #commentSubmitBySummernote': function(e,instance) {
		e.preventDefault();

		var markupStr = instance.$('.summernote').summernote('code');
		if(markupStr.length <= BODY_LENGTH_LAST){
			return throwError('至少需要输入'+ BODY_LENGTH_LAST + '个字符');
		}

		usedImageId = $(markupStr).find('img.imageUp').map(function(index,element){
			return $(element).attr('id');
		}).get();

		var comment = {
			postId: instance.data._id,
			body: markupStr
		}
		Meteor.call('commentInsert',comment,function(error,commentId) {
			if(error){
				return throwError(error.reason);
			}else{
				instance.$('.summernote').summernote('code','');
			}
		});

		deleteWitchNotUsed(witchIsNotUsed(uploadImageId,usedImageId));//方法在summernode.js
	}
});
