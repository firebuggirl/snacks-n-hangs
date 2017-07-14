const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', //User model
    required: 'You must supply an author!'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store', //Store model
    required: 'You must supply a store!'
  },
  text: {
    type: String,
    required: 'Your review must have text!'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

function autopopulate(next) { //make sure that when review is queried it's going to automatically so we don't have to explicitly ask for it
  this.populate('author');
  next();
}

//add hooks to autopopulate author field anytime find or findOne used
reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);


module.exports = mongoose.model('Review', reviewSchema);
