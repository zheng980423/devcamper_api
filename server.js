const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const { errorHandler } = require('./middleware/errorMiddleware');

const connectDB = require('./config/db');
// const logger = require('./middleware/loggerMiddleware');

//Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();
//route files
const bootcamps = require('./routes/bootcampRoutes');
const courses = require('./routes/coursesRoutes');
const auth = require('./routes/authRoutes');

const app = express();

//Body parser
app.use(express.json());
//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use(logger);

//file uploading
app.use(fileupload());
//set static folder
app.use(express.static(path.join(__dirname, 'public')));
//Mount router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);
// app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} MODE on ${PORT} `.yellow.bold
  );
});
