const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {

   

    cached.promise = mongoose.connect(process.env.MONGO_DB).then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;
  console.log('MongoDB Connected:', cached.conn.connection.host);
  return cached.conn;
}

module.exports = connectDB;
