const mongoose = require('mongoose');


// Make sure we are running node 13+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
// if (major <= 7 && minor <= 5) {
if (major < 13 && minor <= 11) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

//mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connect(process.env.LOCAL_DB, { useUnifiedTopology: true, useNewUrlParser: true });
//mongoose.connect(process.env.LOCAL_DB);//deprecated
//mongoose.connect(process.env.DOCKER_DB);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// Import all models

require('./models/Store');


require('./models/User');


require('./models/Review');

// Start app
const app = require('./app');

// Constants for Docker
// const PORT = 7777;
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
