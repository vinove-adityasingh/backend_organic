'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('crypto');
var config = require('./config').get(process.env.NODE_ENV || 'local');
var constant = require('./constant');
// var utility=require('../lib/utility');
var allowed = [
    '/userRegistration',
    '/dwollaUserRegistration',
    '/userLogin',
    '/verifyEmail',
    '/forgetPassword',
    '/changePassword',
    '/loginWithSocial',
    '/listProducts',
    '/addFAQ',
    '/listFAQ',
    '/getInTouch',
    '/getProductDetails',
    '/listTestimonial',
    '/getSubscriptionList'
];

module.exports = {
    ensureAuthorized: function (req, res, next) {
        if (allowed.indexOf(req.path) !== -1) {
            return next();
        }
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            if (config.SECRET) {
                jwt.verify(bearerToken, config.SECRET, async function (err, decoded) {
                    req.user = decoded;
                    if (err) {
                        res.json({
                            status: constant.AUTH_CODE,
                            error: err,
                            message: constant.INVALID_TOKEN
                        });
                    } else {
                        next();
                    }
                });
            } else {
                res.json({
                    status: constant.SERVICE_UNAVAILABLE,
                    error: bearerHeader,
                    message: constant.SERVICE_IS_TEMPORARILY_UNAVILABLE
                });
            }
        } else {
            res.json({
                status: constant.AUTH_CODE,
                message: constant.TOKEN_ERROR
            });
        }
    }
};