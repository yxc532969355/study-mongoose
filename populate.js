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
	
	var aaron = new Person({
		name : 'Aaron',
		age : 100
	});

	aaron.save(function(err, person) {

		console.log(person._id);
		console.log(aaron._id);

		var story1 = new Story({
			title : "Once upon a timex.",
			_creator : person._id
		// assign the _id from the person
		});

		story1.save(function(err) {
			// thats it!
		});
		
		aaron.stories.push(story1);
		
		aaron.save();

	});
	

})
