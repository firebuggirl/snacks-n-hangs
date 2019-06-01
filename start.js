const mongoose = require('mongoose');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major <= 7 && minor <= 5) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}
//run nvm use 7.10 to switch to correct node version

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
//mongoose.connect(process.env.DOCKER_DB);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// READY?! Let's go!

// Import all of our models

require('./models/Store');

//Import all of our users

require('./models/User');

//Import all of our reviews
require('./models/Review');

// Start our app!
const app = require('./app');

// Constants for Docker
// const PORT = 8080;
// const HOST = '0.0.0.0';//Docker host
//
//
// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);


app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

//Temp send email...use to test that Mailtrap testing mail server is working...dev mode only ...tutorial #28
//require('./handlers/mail');
