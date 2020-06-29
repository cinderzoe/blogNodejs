const express = require(`express`)
const router = express.Router()
var mysql = require('mysql');
var linksql = require('../linksql');
const mydb = linksql.db;  
var jwt = require('jsonwebtoken');

router.post('/login', function(req, res,next) { 
  var params = req.body
  login(req,res,params)
})


router.post('/register', (req, res, next) => {
  var params = req.body
  register(req,res,params)
})

router.post('/checktoken',(req,res,next)=>{
  var params=req.body
  checktoken(req,res,params)
})

//用户登陆
function login(req,res,data){
  console.log(data)
  var selectSQL = 'select * from `manager` where username=?'
  mydb.query(selectSQL, data.username,function(err, rows) {  //connection.query是查询数据库的API
      if (err) throw err;
      console.log("login rows:"+rows);
      if(rows.length==0){
        res.json({
          status:202,
          msg:"没有此用户"
        })

      }else{
        if(data.password!==rows[0].password){
          res.json({
            status:201,
            msg:"密码不正确"
          })
        }else{
          req.session.username=rows[0].username;
          var tokenid = jwt.sign(data, 'cindy',{expiresIn: 60*60*24*10}); 
          //data:本身是一个对象，用于储存用户信息的   'cindy':加密字段，可以自己随便定义   expiresIn：过期时间单位是秒
          //三分钟过期失效 60*3=180 1=1秒 
          res.json({
            status:200,
            msg:"登陆成功",
            tokenid:tokenid
          })
        }
      }
  });
}

//用户注册
function register(req,res,data){
  var selectSQL='select * from manager where username=?'
  //var selectSQL2='insert into manager set ?'
  var selectSQL2=`INSERT INTO manager (username,password,niname,introduction) VALUES ('${data.username}','${data.password}','${data.niname}','')`;
  //var selectSQL3=`create table ${data.username}article(id int,title varchar(255),content varchar(255))`
  mydb.query(selectSQL, data.username,function(err, rows) {  //connection.query是查询数据库的API
      if (err) throw err;
      if(rows.length==0){
        mydb.query(selectSQL2, data,function(err, rows) {  //connection.query是查询数据库的API
          if (err) throw err;
          res.json({
            status:200,
            msg:'注册成功'
          })
          // mydb.query(selectSQL3,function(err, rows) {  //建表
          //     if (err) throw err;
          //     else{
          //       console.log("建表成功")
          //     }
          // });
        });
      }else{
        res.json({
          status:'202',
          msg:'该用户名已注册'
        })
      }

  });
}

function checktoken(req,res,data){
  var tokenid=data.headers.Authorization //获取前端请求头发送过来的tokenid
  if(tokenid){
       jwt.verify(tokenid, 'cindy', function(err, decoded) { // decoded:指的是tokneid解码后用户信息
      console.log("checktoken err:"+err);
      if (err) {   //如果tokenid过期
          //return res.send({ success: false, message: 'Failed to authenticate token.' });
          console.log("用户名失效")
          res.json({
            status:202
          })
      } else { //没有过期则
          console.log("用户名没有失效")
          req.decoded = decoded; //将解码信息储存于req中方便其他路由使用
          console.log(decoded)
          res.json({
            user:decoded.username,
            status:200
          })
      }
    })
  }
}

module.exports = router