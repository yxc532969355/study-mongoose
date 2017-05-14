/**
 * http://usejsdoc.org/
 */
/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	var personSchema = mongoose.Schema({
		name : String,
		age : Number,
		stories : [ {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Story'
		} ]
	});

	var storySchema = mongoose.Schema({
		_creator : {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Person'
		},
		title : String,
		fans : [ {
			type : mongoose.Schema.Types.ObjectId,
			ref : 'Person'
		} ]
	});

	var Story = mongoose.model('Story', storySchema);
	var Person = mongoose.model('Person', personSchema);

	Story.findOne({
		title : 'Once upon a timex.'
	})
	// .populate('_creator')
	.exec(function(err, story) {
		if (err)
			return handleError(err);
		console.log(story);
		console.log('The creator is %s', story._creator.name);
		// prints "The creator is Aaron"
	});

	Person.findOne({
		name : 'Aaron'
	}).populate('stories') // only works if we pushed refs to children
	.exec(function(err, person) {
		if (err)
			return handleError(err);
		console.log(person);
	})

	// It is debatable that we really want two sets of pointers as they may get
	// out of sync. Instead we could skip populating and directly find() the
	// stories we are interested in.

	Story.find({
		_creator : aaron._id
	}).exec(function(err, stories) {
		if (err)
			return handleError(err);
		console.log('The stories are an array: ', stories);
	})

})
