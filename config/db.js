const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`mongoDb connected: ${conn.connection.host}`.cyan.underline);
  } catch (erro) {
    console.error(`Error:${erro.message}`.red.underline.bold);
    process.exit(1);
  }
};
module.exports = connectDB;
