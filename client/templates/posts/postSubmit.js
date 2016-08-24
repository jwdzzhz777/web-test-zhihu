//解决方法:https://github.com/meteor/meteor/issues/1434
/*Meteor.startup(function(){
    $(window).bind('beforeunload', function() {
        deleteWitchNotUsed(witchIsNotUsed(allImageId,usedImageId));
        // have to return null, unless you want a chrome popup alert
		var ed;
        return ed;
		//return null 依旧会弹出alert，不return任何东西似乎可以,但会报错,而随便给一个null的对象有时候不会报错
        //return 'Are you sure you want to leave your Vonvo?';
    });
});*///直接放在onDestroyed()内更方便
//下拉菜单不出来是因为有多个包含bootstrap的包，留一个就好。

Template.postSubmit.onCreated(function() {
	Session.set('postSubmitErrors', {});
});

Template.postSubmit.onDestroyed(function(){
	deleteWitchNotUsed(witchIsNotUsed(allImageId,usedImageId));
});

Template.postSubmit.onRendered(function() {
	this.$('.summernote').summernote(getNode());
});

Template.postSubmit.helpers({
	errorMessage: function(field) {
		return Session.get('postSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
	}
});

Template.postSubmit.events({
	'submit form':function(e,instence) {
		e.preventDefault();

		var topic = $(e.target).find('[name=topic]').val();//.val()方法只在表单元素中可用

		var markupStr = instence.$('.summernote').summernote('code');
		/*Template.instance().$('.summernote img.imageUp').each(function(index,element){
			usedImageId.push($(element).attr('id'));
			console.log('img result: ',$(element).attr('id'));
		});*/
		//,map()代替.each()。
		usedImageId = $(markupStr).find('img.imageUp').map(function(index,element){
			return $(element).attr('id');
			console.log('img result: ',$(element).attr('id'));
		}).get();

		var post = {
			title: $(e.target).find('[name=title]').val(),
			body: markupStr,
			topic: topic
		};

		//检测是否填写
		var errors = validatePost(post);//在posts.js中
		if (errors.title || errors.topic || errors.body){
			sAlert.success('上传格式有误',{timeout: 2000,effect:'jelly'});
			return Session.set('postSubmitErrors', errors);
		}

		if(markupStr <= BODY_LENGTH_LAST){
			sAlert.success('你必须至少输入20个字符',{timeout: 2000,effect:'jelly'});
		}

		//检测话题
		var tipicId = Topics.findOne({topic: post.topic});
		if(!tipicId){
			return throwError("暂时没有该话题");
		}
		post.topic = tipicId._id;
		//

		var markupStrWithoutImage = $(markupStr).remove('img').text();
		console.log('submit result: ',markupStrWithoutImage);

		_.extend(post,{
			bodyWithoutImage: markupStrWithoutImage,
			usedImageId: usedImageId
		});
		console.log('posts result: ', post);

		Meteor.call('postInsert',post, function(error,result) {
			if(error){
				return throwError(error.reason);
			}

			if(result.postExists){
				throwError('该问题已经存在！');
				return Router.go('postsPage' , {_id:result._id});
			}

			Router.go('postsPage' , {_id:result._id});
		});

		deleteWitchNotUsed(witchIsNotUsed(allImageId,usedImageId));//方法在summernode.js
	}
});
