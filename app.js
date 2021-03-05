const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('./app/config/crypto');
const bodyParser = require('body-parser');
const fs = require("fs");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./app/swagger/swagger.json');
const morgan = require("morgan");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();

let accessLogStream = fs.createWriteStream(__dirname + "/error.log", {
  flags: "a"
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

global.__rootRequire = function (relpath) {
  return require(path.join(__dirname, relpath));
};

require('./app/config/db');
const config = require('./app/config/config.js').get(process.env.NODE_ENV);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 1000000
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

var whitelist = ['http://localhost:4200', 'http://localhost:3000']

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));
// app.disable('etag');
app.use(
  morgan('combined', {
    skip: function (req, res) { return res.statusCode === 200 },
    stream: accessLogStream
  })
);

app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads/profile', express.static(path.join(__dirname, './uploads/profile')));


// Adding swagger
app.use('/apiDocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', crypto.ensureAuthorized, require('./app/api/routes')(express));


app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log("Server port:", config.port);
app.listen(config.port).timeout = 1800000;



module.exports = app;
