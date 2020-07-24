

const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const multer = require('multer');//handle upload requests/images...server side file type validation
const jimp = require('jimp');//resize photos
const uuid = require('uuid');//unique identifiers for each image that gets uploaded

const multerOptions = {
  storage: multer.memoryStorage(),//save to memory
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};

//middleware
exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');//reads images into memory, does not store into disc

//resize images middleware
exports.resize = async (req, res, next) => { //middleware
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];//split mimetype/filename and get the extension, which is index [1]..ie., jpeg, etc..
  req.body.photo = `${uuid.v4()}.${extension}`;//put photo on body to be stored in DB + add unique identifier
  // now we resize
  // jimp is based off of promises, so we use await
  const photo = await jimp.read(req.file.buffer);//pass in image file that is still in memory/buffer
  await photo.resize(800, jimp.AUTO);//width = 800, height = auto
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;//create relationship between store and author
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

// exports.getStores = async (req, res) => {
//   // 1. Query the database for a list of all stores
//   const stores = await Store.find();
//   res.render('stores', { title: 'Stores', stores });
// };

exports.getStores = async (req, res) => {
  const page = req.params.page || 1; //home page url = 1
  const limit = 6;
  const skip = (page * limit) - limit; //skip 1st six if on page #2, etc...

  // 1. Query the database for a list of all stores
  const storesPromise = Store
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' }); //sort descending...show latest store 1st

//NOTE: 7/2020 countDocuments() replaced .count()
  const countPromise = Store.countDocuments();//get count of all stores in database
//Fire off storesPromise & countPromise @ same time BUT 'wait' for both to come back
  const [stores, countDocuments] = await Promise.all([storesPromise, countPromise]); //pass in array of promises
  const pages = Math.ceil(countDocuments / limit); //get upper limit of # stores / how many per page
  if (!stores.length && skip) {//redirect to last page of pagination if page requested does not exist
    req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
    res.redirect(`/stores/page/${pages}`);
    return;
  }

  res.render('stores', { title: 'Stores', stores, page, pages, countDocuments });
};

//create function to confirmOwner before moving on to editStore middleware + run it inside of editStore
const confirmOwner = (store, user) => {
  //if (!store.author.equals(user._id) || user.level < 10 ) { //for possible future use if have varying levels of admin credentials
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it!');
  }
};

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the store
  confirmOwner(store, req.user);
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // set the location data to be a point
  req.body.location.type = 'Point';//get path from models/Store.js
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
  res.redirect(`/stores/${store._id}/edit`);
  // Redriect them the store and tell them it worked
};

exports.getStoreBySlug = async (req, res, next) => {           // '.populate' = embed info from author...careful not to include sensitive information
  const store = await Store.findOne({ slug: req.params.slug }).populate('author');//req.params = object full of data in url created via the route :slug
  //const store = await Store.findOne({ slug: req.params.slug });
  //res.json(store); //res.render is in controllers/storeController.js instead of being placed in app.js

  if (!store) return next();
  res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };//if there is no tag, fall back to 2nd query which will return any store property that has a tag on it

  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
 //Promise.all = way that you can wait for multiple promises to come back
 //res.json(tags);
 //res.json(stores);
  res.render('tag', { tags, title: 'Tags', tag, stores });
};

exports.searchStores = async (req, res) => {
  //res.json('It worked!');
  //res.json(req.query); //ie., localhost:7777/api/search?q=wine&name=virgil
  const stores = await Store
  // first find stores that match
  .find({
    $text: {//$text operator is available on fields w/ 'text' index
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' } // project score field that has closest match to query
  })
  // then sort them
  .sort({
    score: { $meta: 'textScore' } //take meta score value and sort by value
  })
  // limit to only 5 results
  .limit(5);
  res.json(stores);
};

exports.mapStores = async (req, res) => {
  //res.json({it: "worked!"}); // go to locahost:7777/stores/near
  //res.json(req.query);// type this url to test: localhost:7777/api/stores/near?lat=43&lng=-179 ...returns query of lat and lng
   const coordinates = [req.query.lng, req.query.lat].map(parseFloat);//map over every item in array and turn it into a number....
   //res.json(coordinates);
  const q = { //query
    location: {
      $near: { //MongoDB operator
        $geometry: { // MongoDB operator
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: 10000 // 10km test: http://localhost:7777/api/stores/near?lat=43.2&lng=-79.8
      }
    }
  };

  const stores = await Store.find(q).select('slug name description location photo').limit(10);//chain .select value on .find to specify which fields are to be included
  res.json(stores);
};

exports.mapPage = (req, res) => {
  res.render('map', { title: 'Map' });
};

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());//an array of objects to string
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet'; //check if our hearts/favs includes current ID being posted, if so: use MongoDB $pull, which pulls/removes from array, otherwise $addToSet
  const user = await User                          // $addToSet prevents double posts/values...keeps unique, unlike $push
  .findByIdAndUpdate(req.user._id,//find current user
    { [operator]: { hearts: req.params.id } },
    { new: true }
  );
  res.json(user);
};

exports.getHearts = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts } //query stores & find stores with ID aleady in our current array
  });
  res.render('stores', { title: 'Hearted Stores', stores });
};


exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();//when doing comlex queries like this one, best to put directly in model/schema..in this case, Store.js
  //res.json(stores);
  res.render('topStores', { stores, title:'⭐ Top Stores!'});
}
