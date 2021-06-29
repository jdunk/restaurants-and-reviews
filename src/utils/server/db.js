const mongoose = require('mongoose')

const DB_URI = process.env.MONGODB_URI;

let db;

module.exports = {

  dbConnect() {
    if (!DB_URI) {
      throw new Error('Cannot connect to db. DB_URI is not set.');
    }

    if ('dbConnInitiated' in global) return;

    global.dbConnInitiated = true;

    mongoose.set('returnOriginal', false);
    mongoose.set('useCreateIndex', true);

    mongoose
      .connect(
        DB_URI,
        {useNewUrlParser: true, useUnifiedTopology: true}
      )
      .catch(err => {
        console.error('Error connecting to mongodb:', err)
      });

    db = mongoose.connection;

    db.on('error', console.error.bind(console, 'mongodb connection error:'));
    db.once('open', function() {
      console.log('mongodb connected successfully')
    });
  },

  getDb() {
    return db;
  }
};