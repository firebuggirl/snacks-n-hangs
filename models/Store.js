const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{ //long/lat
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
    photo: String,
    author: {
    type: mongoose.Schema.ObjectId,//create relationship between store and actual user
    ref: 'User',//tell MongoDB that author is going to be referenced to our User
    required: 'You must supply an author'
     }
  }, { //add default setting to virtual field on line #89
    toJSON: { virtuals: true },
    toOjbect: { virtuals: true },

  });

// Define our indexes
storeSchema.index({
  name: 'text', //index name field
  description: 'text' //index description field
});//This is a 'compound index'

storeSchema.index({ location: '2dsphere' });//store metadata about location as Geospatial data to be able to search for stores near lat/long search

storeSchema.pre('save', async function(next) { //because using async await don't need to use callback functions
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);//check to see if any other stores are using same slug
  // find other stores that have a slug of wes, if so, shoule be wes-1, if wes-1, should be wes-2, etc...
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');//'i' is for case insensitive
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });//"^" means begins with, "$" in regex means endswith (0-9 in this case)
  if(storesWithSlug.length) {           //this.constuctor will be = to 'store' when it runs                                 //"?" means than end part "$" is optional
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`; //adds +1 to end of new slug created if there is one that already exists, hence, no duplicate slugs            //ie., looking for a slug that may end in -1, -2, etc...
  }
  next();
  // TODO make more resiliant so slugs are unique
});

// an aggregation is an array
// Take all of the stores and group them together by the tags that they have
// add a method to the schema with .statics
// Do not use arrow function here, instead use a proper function
// because we need to use "this"
// To see pipeline aggregators: https://docs.mongodb.com/manual/reference/operator/aggregation/
// operators always start with "$"
//
storeSchema.statics.getTagsList = function() {
  return this.aggregate([//by putting "$" on tags, means this is a field on my document that I need to unwind
    { $unwind: '$tags' },//before tags can be group, need to use $unwind
    { $group: { _id: '$tags', count: { $sum: 1 } } },//group everything based on tag field, then create new count field in each of those groups called 'count', now each time we group one of these items a count will sum itself by one
    { $sort: { count: -1 } }//sort by most popular..ie., sort by 'count' ascending
  ]);
};

storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    // Lookup Stores and populate their reviews
    // //$lookup will populate our fields..sort of like our virtuals in Mongoose
    // MongoDB auto adds the 's' and lowercase 'r' on reviews
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews' }}, //'as' is what we name the field
    // filter for only items that have 2 or more reviews
    { $match: { 'reviews.1': { $exists: true } } }, //'.1' because zero index '.0' would mean just one review
    // Add the average reviews field
    // {$addField: {//MongoDB version 3.4 for shell based DB...if using MLAB w/ version 3.2, use $project query below
    //   averageRating: {$avg: '$reviews.rating'} ///causes app to crash
    // }},

    { $project: { //if using MLAB w/ version 3.2, use $project query
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating' }//create a new field averageRating & set value of the ratings field of each review...$avg does math for us
    } },                       //'$' on reviews.rating means it is a field from which the data is being piped in, in this case from our '$match' operator above
    // sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 }},
    // limit to at most 10
    { $limit: 10 }
  ]);
}

//new in MongoDB
// Add new field called reviews to schema
// find reviews where the stores _id property === reviews store property
storeSchema.virtual('reviews', {//virtual fields do NOT go into eith an object or into JSON UNLESS you explicityly ask it to...if want to change this....add default setting/object on line #40
  ref: 'Review', // what model to link? ..ie., go to another model (Review) and do query on individual reviews that relate to the _id of each store in this model
  localField: '_id', // which field on the Store model needs to match up w/ which field on our Review model?
  foreignField: 'store' // which field on the review?
});//like a 'join' in MySQL

// display reviews on each store
function autopopulate(next) {
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);
