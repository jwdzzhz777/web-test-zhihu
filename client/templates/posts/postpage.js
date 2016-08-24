Template.postsPage.onRendered(function(){
	/*this.$('.summernote').summernote('code',this.data.body);
	this.$('.summernote').summernote('destroy');*/
	this.$('.clicksummernote').trigger('click');
});

Template.postsPage.helpers({
	comments: function() {
		return Comments.find({postId: this._id});
	}
});
