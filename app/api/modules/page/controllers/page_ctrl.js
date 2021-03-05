'use strict';

var mongoose = require('mongoose'),
    utility = require('../../../../lib/utility.js'),
    jwt = require('jsonwebtoken'),
    crypto = require("crypto"),
    constant = require('../../../../config/constant.js'),
    PAGE = mongoose.model('page'),
    response = require('../../../../lib/response_handler.js'),
    validator = require('../../../../config/validator.js'),
    config = require('../../../../config/config.js').get(process.env.NODE_ENV || 'local'),
    fs = require('fs'),
    commonQuery = require('../../../../lib/commonQuery.js'),
    Joi = require('@hapi/joi');

module.exports = {
    addPage: addPage,
    getPages: getPages,
    updatePage: updatePage,
    deletePage: deletePage
};


/* Function is use to adding new page
 * @access private
 * @return json
 * Created by Aditya Singh
 */
function addPage(req, res) {
    async function asy_add_user() {
        try {

            var schema = Joi.object().keys({
                title: Joi.string().required(),
                content: Joi.string().required(),
                keywords: Joi.array().items(Joi.object().keys({
                    keyword: Joi.string().required(),
                }))
            })

            Joi.validate(req.body, schema, async function (err, value) {
                if (err) {
                    console.log("err------------", err)
                    res.json({
                        code: 201,
                        error: err,
                        // message: config.messages.VALIDATION_ERRORS,
                    });
                } else {
                    try {
                        value.createdBy = req.user.id

                        let user = await commonQuery.InsertIntoCollection(PAGE, value);
                        if (user) {
                            return response(res, constant.SUCCESS_CODE, constant.PAGE_ADD);

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


/* Function is use to fetch list of all pages
 * @access private
 * @return json
 * Created by Aditya Singh
 */

function getPages(req, res) {
    async function asy_init() {
        try {
            let search_string = req.params.search;
            let condition = {

            };
            let populateCondition = {
                path: 'createdBy'
            }
            let query = PAGE.find(condition).populate("createdBy", ["firstname", "lastname"])

            var userList = await commonQuery.fetchAllLimit(query);

            return res.json({
                code: constant.SUCCESS_CODE,
                message: constant.DATA_FETCHED_SUCCESS,
                data: userList
            })

        } catch (e) {
            console.log("-------------", e)
            return res.json({
                code: constant.ERROR_CODE,
                message: constant.SOMETHING_WENT_WRONG
            });
        }

    }
    asy_init();


}


/* Function is use to update page
 * @access private
 * @return json
 * Created by Aditya Singh
 */
function updatePage(req, res) {
    async function asy_add_user() {
        try {

            var schema = Joi.object().keys({
                title: Joi.string().required(),
                content: Joi.string().required(),
                keywords: Joi.array().items(Joi.object().keys({
                    keyword: Joi.string().required(),
                }))
            })

            Joi.validate(req.body, schema, async function (err, value) {
                if (err) {
                    console.log("err------------", err)
                    res.json({
                        code: 201,
                        error: err,
                        // message: config.messages.VALIDATION_ERRORS,
                    });
                } else {
                    try {
                        let condition = { _id: req.params.page_id }
                        let user = await commonQuery.findOneAndUpdate(PAGE, condition, value);
                        if (user) {
                            return response(res, constant.SUCCESS_CODE, constant.PAGE_UPDATE);

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


/* Function is use to delete page
 * @access private
 * @return json
 * Created by Aditya Singh
 */
function deletePage(req, res) {
    async function asy_init() {
        try {
            let condition = {
                _id:req.params.page_id
            };
           

            var page = await commonQuery.deleteOneDocument(PAGE,condition);

            return response(res, constant.SUCCESS_CODE, constant.PAGE_DELETE);

        } catch (e) {
            console.log("-------------", e)
            return res.json({
                code: constant.ERROR_CODE,
                message: constant.SOMETHING_WENT_WRONG
            });
        }

    }
    asy_init();


}




