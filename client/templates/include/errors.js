Template.errors.helpers({
	errors: function() {
		return Errors.find();
	}
});

Template.error.onRendered(function() {
	var currentError = this.data;
	Meteor.setTimeout(function (){
		Errors.remove(currentError._id);},3000);
});
