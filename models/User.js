const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const bcrypt = require('bcrypt');//bcrypt is better than md5 for security
const validator = require('validator');//validate email
const mongodbErrorHandler = require('mongoose-mongodb-errors');//prettify default MongoDb errors
const passportLocalMongoose = require('passport-local-mongoose');//add additional fields and methods to create new logins

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],//validate email from the server side in addition the browser
    required: 'Please Supply an email address'
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  hearts: [ //one to many relationship...will be many hearts/fav stores
    { type: mongoose.Schema.ObjectId, ref: 'Store' } //an array of IDs that are related to a store
  ]

});

// A virtual field in Mongoose is something that can be
// generated on the fly
userSchema.virtual('gravatar').get(function() {
  //const hash = md5(this.email);//md5 is the algorithm used by gravatar to hash user's email address
  const hash = bcrypt.hash(this.email)
  return `https://gravatar.com/avatar/${hash}?s=200`;//S = size
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
