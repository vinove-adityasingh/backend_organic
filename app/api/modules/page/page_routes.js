module.exports = function (router) {

    var page = require('./controllers/page_ctrl');
    var utils= require('../../../lib/util');
    var middlewares = [utils.ensureAuthorized];
    router.post('/page', middlewares, page.addPage);
    router.get('/pages', middlewares, page.getPages);
    router.put('/page/:page_id', middlewares, page.updatePage);
    router.delete('/pages/:page_id', middlewares, page.deletePage);

    return router;
}     