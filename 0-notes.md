# Load Sample Data

To load sample data, run the following command in your terminal:

```bash
`npm run sample`
```

If you have previously loaded in this data, you can wipe your database 100% clean with:

```bash
`npm run blowitallaway`
```

That will populate 16 stores with 3 authors and 41 reviews. The logins for the authors are as follows:

|Name|Email (login)|Password|
|---|---|---|
|Wes Bos|wes@example.com|wes|
|Debbie Downer|debbie@example.com|debbie|
|Beau|beau@example.com|beau|


run `localhost:7777`


* To reference a value/variable in pug file:

` #{dog} ` ....for text
alt=`Dog ${dog}`  ....for attributes have to use es6 JS syntax


* To override block header in layout.pug,
type `block header` in `index.js` (or other template file) to override template header in layout.pug


- `app.use` => global middleware


* To create a 'dump' similar to var dump, put this code into pug file:
ex, in ` _storeForm.pug: pre= h.dump(store)`


## Steps to creating a new store route:

 - 1) Create new route via routes/index.js
 - 2) Create a controller via controllers/storeController.js ..ie., exports.getStoreBySlug....this queries database for data and passes the data to be rendered to the template
 - 3) create a store.pug file
 - 4) For Google maps config/params, see exports.staticMap in helpers.js (note: MongoDB does lat/long and Google does long/lat). Place this helper in store.pug file...ie.,     img.single__map(src=h.staticMap(store.location.coordinates))

*  NOTE: `backticks` are used when generating value for href on the fly

 - Models only need to be imported once in start.js


## Reset lost/forgotten password

### Multi-step process:

- set a reset token, along with an expiration date, in user if user has email address on file

- email info to user, and if user has proper token and date that is not expired, then they will be able to reset password

- `index.js`:

  - create post route for /account/forgot
  - 'get' route for /account/reset/:token
  - 'post' route for /account/reset/:token


-  `authController.js`:

  - create 'forgot' authentication method
  - import Mongoose
  - include reference to user model
  - Send them an email with the token
  - redirect to login page
  - create exports.reset method in authController.js
  - create exports.confirmedPasswords method/middleware
  - create exports.update method/middleware
  - require promisify
  - create setPassword method/middleware

- `User.js`:

 - add resetPasswordToken: String,
 - resetPasswordExpires: Date to userSchema

- `reset.pug`:

 - create reset.pug file with reset form...leave off "action"   attribute so page will return to itself

## Sending email with Node.js

 * authController.js:

 const mail = require('../handlers/mail');

 * handlers/mail.js:
   const nodemailer = require('nodemailer');
   const pug = require('pug');
   const juice = require('juice');
   const htmlToText = require('html-to-text');
   const promisify = require('es6-promisify');

 * authController.js:
 - add req.flash('success', `You have been emailed a password reset link.`); to exports.forgot method
 - add const mail = require('../handlers/mail');
 - add   
   await mail.send({
    user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  });

  `Mailtrap.io (freemium version)` - rather than setting up email with SMTP server like Postmark app for real email, use Mailtrap for dev mode..fakes being a mail server
  -grab username and mail password from Mailtrap SMTP settings interface and add to variables.env file

 https://mailtrap.io/

  transport = way to deal with sending different ways of sending email, w/ SMTP being the most popular

  ## Create a relationship between each store and each actual  

 * `Store.js`:

   ```js
    author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
    }
    ```

 * controllers/storeController.js:

 - add this to exports.createStore method/middleware-

    ` req.body.author = req.user._id; `

 - create new store, go to database and query user and store collections to see relationship created via
  ` "_id": ObjectId `

 - "populate" = bring in info about author and place/embed in store  collection

 - add to exports.getStoreBySlug to embed info about author into each store collection-

     `.populate('author');` - do not include sensitive info

 - add:

  ` const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
      throw Error('You must own a store in order to edit it!');
    }
  }; `

 - run this function inside of editStore:

   ` confirmOwner(store, req.user); `


  * store.pug:
   ..do quick dump of store to see `author _id` in store collection...
     ` pre= h.dump(store) `

* Create new user account and new store...now cannot edit stores can only be accomplished
if the correct user is logged in!


  * Update interface so can only see edit/pencil icon that relates to specific user/store owner

  * storeCard.pug add:

 `if user && store.author.equals(user._id)`

## Ajax Rest API

- `Loading sample data`:

    "sample" script in package.json -> runs script called load-sample-data.js (not part of our app, so need to 'require' env variables + connection to DB, etc..) + "blowitallaway" does the same, but then deletes everything

    run:

    ` npm run sample `

    `run blowitallaway` ....deletes all data

## JSON endpoints and creating MongoDB indexes

- `Store.js`:

  - define indexes ...index type of 'text' enables search for stores, etc...can now use '$text' operator on queries

  - create compound index on 'name' and 'description' fields

- `Mongo shell examples`:

  `db.events.createIndex( { "name" : "text", "description" : "text" }` ....already created this in Store.js

  - run  `'db.stores.getIndexes()'` to see indexes or check in 'compass' app interface

  - Search ex:

  - `db.stores.find( { $text: { $search: "coffee" } } )`

- `routes/index.js`:

  - `router.get('/api/search', catchErrors(storeController.searchStores));`

  -  controllers/storeController:
      create searchStores method

## Create AJAX Search interface

- create typeAhead.js


* public/javascripts/delicious-app.js:

  - import typeAhead from './modules/typeAhead';
  - ` typeAhead( $('.search') ); `

## Create Geospatial Ajax endpoint

* Store.js:

  - ` storeSchema.index({ location: '2dsphere' }) `;//store metadata about location as Geospatial data to be able to search for stores near lat/long search

  - Mongo shell..search for new index (or use Compass app):

  ` db.stores.getIndexes() `

* index.js:

  - ` router.get('/api/stores/near', catchErrors(storeController.mapStores)); `

* controllers/storeController.js:

  - create mapStores method

## Plotting Stores on a Custom Google Map / use own API (for images in map) from own site


* routes/index.js:

- ` router.get('/map', storeController.mapPage); `


- controllers/storeController.js:

  ```js
  exports.mapPage = (req, res) => {
    res.render('map', { title: 'Map' });
  };
  ```

- don't forget to include "photo" field on line 153 in order to see our API/photo for each location appear in maps

`const stores = await Store.find(q).select('slug name description location photo').limit(10);`

- `public/javascripts/modules` directory:

## create map.js file

 *  create makeMap
 * loadPlaces
 * mapOptions functions
 * add import { $ } from './bling';

* public/javascripts/delicious-app.js:

  - `makeMap( $('#map') );`
  - import makeMap from './modules/map';

* views directory:
 - create map.pug file


* layout.pug:

Google maps library is already loaded `https://maps.googleapis.com/maps/api/js?key=${process.env.MAP_KEY}&libraries=places`

## Pushing user data to our API

-  models/User.js:

```js
 hearts: [
    { type: mongoose.Schema.ObjectId, ref: 'Store' }
  ]
```

* mixins/storeCard.pug:

```js
   if user
    .store__action.store__action--heart
      form.heart(method="POST" action=`/api/stores/${store._id}/heart`)
        - const heartStrings = user.hearts.map(obj => obj.toString())
        - const heartClass = heartStrings.includes(store._id.toString()) ? 'heart__button--hearted' : ''
        button.heart__button(type="submit" name="heart" class=heartClass)
          != h.icon('heart')
    ```

 * routes/index.js:

 ` router.post('/api/stores/:id/heart',   catchErrors(storeController.heartStore)); `

* controllers/storeController.js:

- create exports.heartStore method/middleware

- const User = mongoose.model('User');


* public/javascripts/modules:

 - create new heart.js file to update hearts/favs on the fly w/out page refresh


* public/javascripts/delicious-app.js:

    const heartForms = $$('form.heart');
    heartForms.on('submit', ajaxHeart);

    import ajaxHeart from './modules/heart';

    ...don't forget to refresh DB after changes

## Displaying hearted stores

* routes/index.js:

  `router.get('/hearts', storeController.getHearts);`

  * controllers/storeController.js:

  ```js
    exports.getHearts = async (req, res) => {
      const stores = await Store.find({
        _id: { $in: req.user.hearts }
      });
      res.render('stores', { title: 'Hearted Stores', stores });
   };
   ```

## Adding a reviews data model


* routes/index.js:

  - require new reviews model
    ` const reviewController =  require('../controllers/reviewController'); `

  ```js
   router.post('/reviews/:id',
    authController.isLoggedIn,
    catchErrors(reviewController.addReview)
  );  
  ```


* models directory:

 - create new Review.js model/schema

* controllers directory:

    - create new reviewController.js file + new addReview method/middleware


* views/mixins directory:

 - create new `_reviewForm.pug` template


* views/store.pug:

 - add `_reviewForm` mixin

 - ` include mixins/_reviewForm `

 - ` if user
      +reviewForm(store) `

* start.js:

  - Import all of our reviews

   ` require('./models/Review'); `


  - re-start database...

## Advanced Relationship Population- Displaying our reviews

* models/Store.js:

    - find reviews where the stores ` _id property === reviews store property `

    ```js
     storeSchema.virtual('reviews', {
      ref: 'Review', // what model to link?
      localField: '_id', // which field on the store?
      foreignField: 'store' // which field on the review?
    });
    ```

   - add default setting to virtual field on line #89

   ```js
    {
     toJSON: { virtuals: true },
     toOjbect: { virtuals: true }
   }
   ```


* models/Review.js:

  - make sure that when review is queried it's going to automatically populate our author field

  ```js
    function autopopulate(next) {
      this.populate('author');
      next();
    }
  ```

  `reviewSchema.pre('find', autopopulate);`
  `reviewSchema.pre('findOne', autopopulate);`

* models/Store.js:

  - display reviews on each store:

  ```js
    function autopopulate(next) {
        this.populate('reviews');
        next();
      }
  ```

    `storeSchema.pre('find', autopopulate);`
    `storeSchema.pre('findOne', autopopulate);`


* views/mixins directory:

 - create new `_review.pug` template   

* views/store.pug:

  - loop over each review per store

  ```js
    if store.reviews
          .reviews
            each review in store.reviews
              .review
                +review(review)

    ```

     - include review mixin

     - include` mixins/_review`

## Advanced aggregation


* Get list of top 10 stores based on their avg rating:

    * routes/index.js:

    `router.get('/top', catchErrors(storeController.getTopStores``

* controllers/storeController.js:

```js
 exports.getTopStores = async (req, res) => {
  const stores = await Store.getTopStores();
  res.render('topStores', { stores, title:'⭐ Top Stores!'});
}
```

* views directory:

 - create topStores.pug template

* models/Store.js:

  - create aggregation query to get top stores

* data/load-sample-data.json:

    - uncomment out these lines

    ```js
    // line 10
    const Review = require('../models/Review');

    //line 15
    const reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'));

    //line 21
    await Review.remove();

    //line 30
    await Review.insertMany(reviews);
    ```

    - stop server

    - delete all current stores and import new ones

    `npm run blowitallaway`

    `npm run sample` ///import new data

    `npm start` //restart server


* display how many reviews are on each store:

* models/Store.js:

* create `autopopulate function`

  ```js
   views/mixins/_storeCard.pug:

    if store.reviews
      .store__action.store__action--count
        != h.icon('review')
        span= store.reviews.length
    ```

## Implementing pagination

* routes/index.js:

    line 11
    ` router.get('/stores/page/:page',  catchErrors(storeController.getStores)); `

* controllers/storeController.js:

    - modify getStores method to implement pagination

* views/mixins directory:

 -create new `_pagination.pug` template

* views/stores.pug

  - include `_pagination.pug` mixin

  - include `mixins/_pagination`

   +pagination(page, pages, count)

## Deployment

* create .gitignore file:

      add:

      ```yaml
        variables.env
        variables.env.now
        node_modules/
        .DS_Store
        *.log
        .idea
        haters/
      ```


* variable.env file:

  - If have test database, create 2nd database
  ..can use MLAB...

  - If creating your own MongoDB database, must set username and password to prevent getting hacked!
  By default MongoDB does not come w/a username and Password!


 - Use https://postmarkapp.com for email service


 - Change port in .env to 80

* package.json:

  rename start to 'dev' ..now run npm run dev instead of start whenever need to run app locally

  run node start.js to start app

## Deploy to 'Now'


https://zeit.co/now

In package.json:

    - rename site/app

   ```json
   "now": {
      "dotenv": "variables.env.now"
    }
    ```

- copy/paste variable.env and create variables.env.now

    `npm install now -g`

  - run `now` //From directory to be deployed

    https://snacks-n-hangs-mviteyfgka.now.sh

## Deploy to Heroku


* 1- create new app via Heroku UI
   -set up env variables via Heroku UI/Settings/Config Vars + choose node buildpack


* Bash:
* 2-
  $ heroku login
  $ cd my-project/
  $ git init
  $ heroku git:remote -a snacks-n-hangs
  $ git add .
  $ git commit -am "make it better"
  $ git push heroku master


- If existing Git repo, but in this case not:
  $ heroku git:remote -a snacks-n-hangs


## Upgrade Heroku Stack 2023

```yaml
# find outdated appl
heroku plugins:install apps-table
heroku apps:table --filter="STACK=heroku-18"

# create a test app deploy 1st
heroku create --remote heroku-22 --stack heroku-22 snacks-n-hangs-heroku-22

heroku addons --remote heroku

# For each of the add-ons listed, create a corresponding counterpart on your test app:

heroku addons:create --remote heroku-22 auth0

heroku addons:create --remote heroku-22 snyk

# For any config var present on your existing app that isn’t yet set on your test app, set it on the test app:

heroku config:set --remote heroku-22 <name>=<value>
```

* Watch Sass in separate terminal:

`sass --watch public/sass/style.scss:public/dist/style.css`

## For security checks run:

`nsp check`
