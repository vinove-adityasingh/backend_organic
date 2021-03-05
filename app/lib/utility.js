'use strict';

var Config = require('../config/config').get(process.env.NODE_ENV || 'local');
let moment = require('moment');
var fs = require("fs");
var path = require('path');
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var utility = {};
var mongoose = require('mongoose');



utility.generateRandomString = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}
utility.removeOffset = function removeOffset(dobFormat) {
    console.log("RemoveOffset: ", dobFormat)
    var userOffset = new Date(dobFormat).getTimezoneOffset();
    var userOffsetMilli = userOffset * 60 * 1000;
    //var dateInMilli = moment(new Date(dobFormat)).unix()*1000
    var dateInMilli = moment(new Date(dobFormat)).valueOf();
    var dateInUtc = !isNaN(userOffsetMilli) ? dateInMilli - userOffsetMilli : "";
    return dateInUtc;
};

utility.addOffset = function addOffset(dobFormat) {
    var userOffset = new Date(dobFormat).getTimezoneOffset();
    var userOffsetMilli = userOffset * 60 * 1000;
    //var dateInMilli = moment(dobFormat).unix()*1000
    var dateInMilli = moment(new Date(dobFormat)).valueOf();
    var dateInUtc = !isNaN(userOffsetMilli) ? dateInMilli + userOffsetMilli : "";
    return dateInUtc;
};

utility.getUserIdFromToken = function (token) {
    if (token) {
        var authorization = token,
            decoded;
        try {
            decoded = jwt.verify(authorization, Config.SECRET);
        } catch (e) {
            console.log('err inside -->80', e)
            return { code: 401, message: 'Unauthorised' };
        }
        let userId = decoded.id;
        console.log('decode', decoded);
        return { code: 200, message: "Authorised", data: decoded.id }
    } else {
        return { code: 400, message: 'Token not found' };

    }

}
utility.getEncryptText = function (text) {
    var cipher = crypto.createCipher(constant.cryptoAlgorithm, constant.cryptoPassword);
    text = cipher.update(text, 'utf8', 'hex');
    text += cipher.final('hex');
    return text;
}


utility.capitalize = function (input) {
    return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
}

module.exports = utility;