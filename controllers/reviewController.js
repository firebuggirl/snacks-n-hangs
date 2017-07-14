const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.addReview = async (req, res) => {
  //res.json(req.body);
  req.body.author = req.user._id;
  req.body.store = req.params.id;//store ID is in the URL (ie., params)
  const newReview = new Review(req.body); //create new review model
  await newReview.save();
  req.flash('success', 'Revivew Saved!');
  res.redirect('back');
};
