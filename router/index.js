module.exports = function (app) {
    
    //登录注册模块
    var login = require('../respone/login');
    app.use('/', login);

    var article = require('../respone/article');
    app.use('/', article);

    var personInfo = require('../respone/personInfo');
    app.use('/', personInfo);

};
