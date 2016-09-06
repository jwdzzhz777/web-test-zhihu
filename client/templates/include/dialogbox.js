Template.dialogBox.helpers({
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
