module.exports = function (router) {

    var user = require('./controllers/user_ctrl');
    // var utils = __rootRequire('app/lib/util');
    var utils= require('../../../lib/util');
    var middlewares = [utils.ensureAuthorized];
    console.log("two-------------")
    //free auth
    router.post('/userRegistration', user.userRegistration);
    router.post('/userLogin', user.userLogin);
    return router;
}     