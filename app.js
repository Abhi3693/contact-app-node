const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const errorController = require('./controllers/errorController');
const contactsRouter = require('./routes/contacts');
const messagesRouter = require('./routes/messages');

// Connect to database
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_CONNECTION)
  .then((res) => console.log('Connected to DB'))
  .catch((err) => console.log(err));

// Instantiate app
const app = express();

// middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/contacts', contactsRouter);
app.use('/api/messages', messagesRouter);
app.use(errorController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// listening to port
app.listen(process.env.PORT || 3001);
