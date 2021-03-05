'use strict';

var mongoose = require('mongoose'),
    utility = require('../../../../lib/utility.js'),
    jwt = require('jsonwebtoken'),
    crypto = require("crypto"),
    constant = require('../../../../config/constant.js'),
    USER = mongoose.model('user'),
    response = require('../../../../lib/response_handler.js'),
    validator = require('../../../../config/validator.js'),
    config = require('../../../../config/config.js').get(process.env.NODE_ENV || 'local'),
    fs = require('fs'),
    commonQuery = require('../../../../lib/commonQuery.js'),
    Joi = require('@hapi/joi');

module.exports = {
    userRegistration: userRegistration,
    userLogin: userLogin,
};


/* Function is use to Register new User
 * @access private
 * @return json
 * Created by Aditya Singh
 */
function userRegistration(req, res) {
    async function asy_add_user() {
        try {

            var schema = Joi.object().keys({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
        
            }).with('email', 'password');
            const options = {
                allowUnknown: false
            }

            Joi.validate(req.body, schema, options, async function(err, value) {
                if (err) {
                    console.log("err------------",err)
                    res.json({
                        code: 201,
                        error: err,
                        // message: config.messages.VALIDATION_ERRORS,
                    });
                } else {
                    try {

                    console.log("value--------",value)
                    value.status= "active";
    
                let user = await commonQuery.InsertIntoCollection(USER, value);
                if (user) {
                        let registereddata = {
                            FIRST_NAME: user.firstname,
                            LAST_NAME: user.lastname,
                            EMAIL: user.email,
                        }
                        return response(res, constant.SUCCESS_CODE, constant.NEW_USER_SAVE_SUCCESS, registereddata);   
    
                }
            } catch (err) {
                console.log('error1234', err)
                return response(res, constant.ERROR_CODE, err);
            };
                }
                })
                } catch (err) {
                    console.log('error1234', err)
                    return response(res, constant.ERROR_CODE, err);
                };
            
    }
    asy_add_user().then(data => { });
}

/* Function is use to Login registered user
 * @access private
 * @return jsoncompareSync
 * Created by Aditya Singh
 */

function userLogin(req, res) {
    async function asy_init_login() {
        try {
            if (req.body.email && req.body.password) {
                let condition = {
                    email: req.body.email,
                    isDeleted: false,
                }
                let user = await commonQuery.findoneData(USER, condition);
                if (user) {
                    if (user.status==='active') {

                        user.comparePassword(req.body.password, async function (err, isMatch) {
                            if (isMatch) {


                                let params = {
                                    id: user._id,
                                    email: user.email,
                                };
                                let jwtToken = jwt.sign(params, config.SECRET, {
                                    expiresIn: 60 * 60 * 24 * 15 // expiration duration 8 Hours
                                });
                                if (validator.isValid(jwtToken)) {
                                    let userdata = {}
                                    userdata.firstname = user.firstname,
                                        userdata.lastname = user.lastname,
                                        userdata.email = user.email,
                                        userdata.token = 'Bearer ' + jwtToken
                                    return response(res, constant.SUCCESS_CODE, constant.SIGNIN_SUCCESS, userdata);
                                }
                                else {
                                    return response(res, constant.ERROR_CODE, constant.INVALID_TOKEN);
                                }


                            }
                            else {
                                return res.json({
                                    code: constant.ERROR_CODE,
                                    message: constant.INVALID_LOGIN_DETAILS
                                });
                            }
                        })
                    }
                    else {
                        return res.json({
                            code: constant.ERROR_CODE,
                            message: constant.ACCOUNT_ACTIVATION
                        });
                    }
                }
                else {
                    return response(res, constant.AUTH_CODE, constant.INVALID_LOGIN_DETAILS);

                }

            } else {
                return res.json({
                    code: constant.ERROR_CODE,
                    message: constant.LOGIN_REQUIRED_FIELDS
                });
            }
        } catch (e) {
            return res.json({
                code: constant.ERROR_CODE,
                message: constant.SOMETHING_WENT_WRONG
            });
        }
    }
    asy_init_login();
}




