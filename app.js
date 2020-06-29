
const express = require('express');
const app = express();
const bodyParser=require('body-parser');
const router = require('./router/index')
const cookieParser = require('cookie-parser');
const session = require('express-session')
var mysql = require('mysql');
var linksql = require('./linksql');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: false,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 60*24*3, // 设置 session 的有效时间，单位毫秒,现在有效期是3天
    },
}));

// require('./cors') 
//设置跨域问题
app.use((req,res,next)=>{
	if( req.headers.origin == "http://www.lazyzoe.cn" || req.headers.origin == "http://lazyzoe.cn" ){
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }else{
        res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //为了跨域保持session，所以指定地址，不能用*
    }
 	// res.header("Access-Control-Allow-Credentials", "true"); 
  //   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
　　res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
　　res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
　　if (req.method == 'OPTIONS') {
　　　　res.send(200); /*让options请求快速返回*/
　　} else {
　　　　next();
　　}
})

// app.use((req,res,next)=>{
//    res.header("Access-Control-Allow-Credentials", "true"); 
// 	// res.header('Access-Control-Allow-Origin', '*');
// 　　res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); //允许http://localhost:8081访问
// 　　res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
// 　　res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
// 　　if (req.method == 'OPTIONS') {
// 　　　　res.send(200); /*让options请求快速返回*/
// 　　} else {
// 　　　　next();
// 　　}
// })


//配置路由模块
router(app);

app.listen(3000);
