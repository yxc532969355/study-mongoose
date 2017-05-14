/**
 * http://usejsdoc.org/
 */

var schema = new Schema({
	name : {
		type : String,
		required : true
	}
});
var Cat = db.model('Cat', schema);

// This cat has no name :(
var cat = new Cat();
cat.save(function(error) {
	assert.equal(error.errors['name'].message, 'Path `name` is required.');

	error = cat.validateSync();
	assert.equal(error.errors['name'].message, 'Path `name` is required.');
});


var breakfastSchema = new Schema({
    eggs: {
      type: Number,
      min: [6, 'Too few eggs'],
      max: 12
    },
    bacon: {
      type: Number,
      required: [true, 'Why no bacon?']
    },
    drink: {
      type: String,
      enum: ['Coffee', 'Tea'],
      required: function() {
        return this.bacon > 3;
      }
    }
  });
  var Breakfast = db.model('Breakfast', breakfastSchema);

  var badBreakfast = new Breakfast({
    eggs: 2,
    bacon: 0,
    drink: 'Milk'
  });
  var error = badBreakfast.validateSync();
  assert.equal(error.errors['eggs'].message,
    'Too few eggs');
  assert.ok(!error.errors['bacon']);
  assert.equal(error.errors['drink'].message,
    '`Milk` is not a valid enum value for path `drink`.');

  badBreakfast.bacon = 5;
  badBreakfast.drink = null;

  error = badBreakfast.validateSync();
  assert.equal(error.errors['drink'].message, 'Path `drink` is required.');

  badBreakfast.bacon = null;
  error = badBreakfast.validateSync();
  assert.equal(error.errors['bacon'].message, 'Why no bacon?');
  
  

  var uniqueUsernameSchema = new Schema({
    username: {
      type: String,
      unique: true
    }
  });
  var U1 = db.model('U1', uniqueUsernameSchema);
  var U2 = db.model('U2', uniqueUsernameSchema);

  var dup = [{ username: 'Val' }, { username: 'Val' }];
  U1.create(dup, function(error) {
    // Will save successfully!
  });

  // Need to wait for the index to finish building before saving,
  // otherwise unique constraints may be violated.
  U2.on('index', function(error) {
    assert.ifError(error);
    U2.create(dup, function(error) {
      // Will error, but will *not* be a mongoose validation error, but
      // a duplicate key error.
      assert.ok(error);
      assert.ok(!error.errors);
      assert.ok(error.message.indexOf('duplicate key error') !== -1);
    });
  });
  