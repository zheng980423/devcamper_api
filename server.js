const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

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
const users = require('./routes/userRoutes');
const reviews = require('./routes/reviewsRoutes');

const app = express();

//Body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());
//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use(logger);

//file uploading
app.use(fileupload());

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());
//prevent xss attacks
app.use(xss());
// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100,
});

app.use(limiter);

//prevent hpp param pollution
app.use(hpp());

//enable CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
//Mount router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);
// app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} MODE on ${PORT} `.yellow.bold
  );
});
