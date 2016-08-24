Template.userPage.helpers({
	usericon: function() {
		var icon = UserTopics.findOne({userId: this.user._id,userIcon: {$exists:true}});
		if(icon){
			var icons = Icons.findOne(icon.userIcon)
			if(icons){
				return icons.url({store: 'large'});
			}
		}else{
			return "/t404.jpg";
		}
	},
	icons: function(){
		return Icons.find();
	},
	isUpload: function(){
		return this.hasStored('large');
	}
});

Template.userPage.events({
	'change #img': function(event,template){
		var dialog = $('#iconProgressDialog');
		var oldid;
		usertopics = UserTopics.findOne({userId: this.user._id,userIcon: {$exists:true}});
		if(usertopics){
			oldid = usertopics.userIcon;
		}
		dialog.dialog('open');
		FS.Utility.eachFile(event,function(file){
			file.owner = Meteor.userId();
			console.log('file result: ', file);
			Icons.insert(file, function (err,fileObj) {
				if(err){
					throwError(err);
				}
				Session.set('fileObIconjId',fileObj);
			});
		});
		Meteor.startup(function(){
			Tracker.autorun(function() {
				if(icon = Session.get('fileObIconjId')){
					if(
						icon.hasStored('icon') 		&&
						icon.hasStored('small') 	&&
						icon.hasStored('middle') 	&&
						icon.hasStored('large')
					){
						Session.set('fileObIconjId');
						//虽然还没有结束 但是图片已经可以显示,这句控制跟踪的停止。
						var user = Meteor.user();

						usericon = {
							userId: user._id,
							userIcon: icon._id
						};

						Meteor.call('userIconInsert',usericon, function(error,result){
							if(error){
								rthrowError(error.reason);
							}
							if(result){
								Icons.remove(oldid);
								dialog.dialog('close');
								sAlert.success('上传已完成',{timeout: 2000,effect:'jelly'});
							}
						});
					}
				}
			});
		});
	}
});
