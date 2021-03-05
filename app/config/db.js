'use strict';
var mongoose = require('mongoose');

//All models schema test
require("../api/modules/user/model/userSchema");
require("../api/modules/page/models/pageSchema");



if (!process.env.NODE_ENV || process.env.NODE_ENV == undefined) {
    process.env.NODE_ENV = 'live';
}
const config = require('./config').get(process.env.NODE_ENV);

console.log("dburl", config.DATABASE.host + config.DATABASE.port + "/" + config.DATABASE.dbname)
mongoose.Promise = global.Promise;
// mongoose.connect(config.DATABASE.host + config.DATABASE.port + "/" + config.DATABASE.dbname);

mongoose.connect(config.DATABASE.host + config.DATABASE.port + "/" + config.DATABASE.dbname, { user: config.DATABASE.user, pass: config.DATABASE.pass });

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
    console.log("Database conencted successfully!");
});