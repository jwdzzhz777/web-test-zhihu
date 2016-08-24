Template.commentSubmit.onCreated(function() {});

Template.commentSubmit.onRendered(function() {
	this.$('.summernote').summernote(getNode());
});

Template.commentSubmit.onDestroyed(function(){
	deleteWitchNotUsed(witchIsNotUsed(allImageId,usedImageId));
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

		deleteWitchNotUsed(witchIsNotUsed(allImageId,usedImageId));//方法在summernode.js
	}
});
