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

Template.postsItem.onRendered(function(){
	this.$('.summernote').on('click','img.imageUp',function(e){
		var $dialog = $('#imgBox');
		$dialog.find('#imgToShow').attr('src',$(e.target).attr('src'));
		$dialog.on('click','.dialogCloseButton', function(e){
			$dialog.dialog('close');
		});
		$dialog.dialog('open');
	});
});

Template.postSubmit.onDestroyed(function(){
	deleteWitchNotUsed(witchIsNotUsed(uploadImageId,usedImageId));
});

Template.postsItem.helpers({
	upvotedClass: function() {
		var userId = Meteor.userId();
		if(userId && !_.include(this.upvoters, userId)) {
			return 'btn-primary upvotable';
		}else{
			return 'disabled';
		}
	},
	topicc: function(id) {
		var topic = Topics.findOne(id);
		return topic.topic;
	},
	topicId: function(){
		var atopic = new Array();
		/*$(this.topicId).each(function(index,element) {
			var topic = Topics.findOne(element);
			atopic[index] = topic;
		});*/
		var topic = Topics.findOne(this.topic);
		atopic[0] = topic;
		return atopic;
	},
	topiccc: function() {
		var topics = Topics.findOne(this.topic);
		return topics.topic;
	},
	usericon: function() {
		var icon = UserTopics.findOne({userId: this.userId,userIcon: {$exists:true}});
		if(icon){
			var icons = Icons.findOne(icon.userIcon)
			return icons.url({store: 'middle'});
		}else{
			return "/t404.jpg";
		}
	},
	hasImg: function(){
		if(this.usedImageId.length === 0){
			return false;
		}else{
			return true;
		}
	},
	firstImg: function(){
		var id = this.usedImageId;
		var image = Images.findOne(id[0]);
		if(image){
			return image.url();
		}
	},
	isPostPage:function (){
		var name = Router.current().route.getName();
		return name === 'postsPage';
	},
	isPostsUser:function(){
		var id = Meteor.userId();
		return id === this.userId;
	}
});

Template.postsItem.events({
	'click .upvotable': function(e) {
		e.preventDefault();
		Meteor.call('upvote', this._id);
	},
	'click .clicksummernote': function(e,instance){
		e.preventDefault();
		$(e.target).closest('.summernote').append(instance.data.body);
		$(e.target).closest('.clicksummernote').remove();//删除
	},
	'saveAndCancel:show #saveAndCancel':function(e,instance){
		$(e.target).css({
			visibility: 'visible'
		});
	},
	'saveAndCancel:hidden #saveAndCancel':function(e,instance){
		$(e.target).css({
			visibility: 'hidden'
		});
	},
	'editBody:show #editBody':function(e,instance){
		$(e.target).css({
			visibility: 'visible'
		});
	},
	'editBody:hidden #editBody':function(e,instance){
		$(e.target).css({
			visibility: 'hidden'
		});
	},
	'click #editBody': function(e,instance){
		instance.$('#saveAndCancel').trigger('saveAndCancel:show');
		instance.$('#editBody').trigger('editBody:hidden');
		instance.$('.summernote').summernote(getNode()).summernote('code',this.body);
	},
	'click #editCancle':function(e,instance){
		instance.$('#saveAndCancel').trigger('saveAndCancel:hidden');
		instance.$('#editBody').trigger('editBody:show');
		instance.$('.summernote').summernote('code',this.body);
		instance.$('.summernote').summernote('destroy');
		deleteWitchNotUsed(witchIsNotUsed(uploadImageId,usedImageId));
	},
	'click #editSave':function(e,instance){
		e.preventDefault();
		var oldUsedImageId = instance.data.usedImageId;
		var markupStr = instance.$('.summernote').summernote('code');
		var markupStrWithoutImage = $(markupStr).remove('img').text();
		if(markupStrWithoutImage.length <= BODY_LENGTH_LAST){
			return sAlert.success('你必须至少输入20个字符',{timeout: 2000,effect:'jelly'});
		}

		usedImageId = $(markupStr).find('img.imageUp').map(
				function(index,element){return $(element).attr('id');}
			).get();

		var post = {
			id: this._id,
			body: markupStr,
			bodyWithoutImage: markupStrWithoutImage,
			usedImageId: usedImageId
		}

		Meteor.call('updatePosts',post,function(error,result){
			if(error){
				return throwError(error.reason);
			}

			if(result){
				instance.$('#editCancle').trigger('click');
			}
			var delete1 = witchIsNotUsed(uploadImageId,usedImageId);
			var delete2 = witchIsNotUsed(oldUsedImageId,usedImageId);
			deleteWitchNotUsed(delete1);
			deleteWitchNotUsed(delete2);
		});

	}
});
