

// Import mongoose 
const mongoose = require('mongoose');

// Connect to MongoDB using the updated options
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
 
// Save connection to a variable
  const db = mongoose.connection
// Tell what to do once the connection is establish
  db.on('connection', function() {
    console.log(`Connected to MongoDb ${db.name} at ${db.host}:${db.port}`)
  })


// This exports the module
module.exports = mongoose