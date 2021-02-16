const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

//load models
const Bootcamp = require('./models/bootcampModel');

//conect to db
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

//read json fille
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

//import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('data impoted...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(err);
  }
};
//delete data
const destroyData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(err);
  }
};
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
