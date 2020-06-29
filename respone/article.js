const express = require(`express`)
const router = express.Router()
var mysql = require('mysql');
var linksql = require('../linksql');
const mydb = linksql.db;  
var jwt = require('jsonwebtoken');

//var connection = mysql.createConnection(linksql.db);
//connection.connect(); //开启数据库链接

router.post('/articleWrite', function(req, res,next) { 
  var params = req.body
  articleWrite(req,res,params)
})
router.post('/articleGet', function(req, res,next) { 
  var params = req.body
  articleGet(req,res,params)
})
router.post('/articleDetailsGet', function(req, res,next) { 
  var params = req.body
  articleDetailsGet(req,res,params)
})
router.post('/articleDelete', function(req, res,next) { 
  var params = req.body
  articleDelete(req,res,params)
})
router.post('/articleUpdate', function(req, res,next) { 
  var params = req.body
  articleUpdate(req,res,params)
})



function articleWrite(req,res,data){
  var selectSQL=`insert into article set ?`
  mydb.query(selectSQL,data,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
      	res.sendStatus(200)
      }
  });
}

function articleGet(req,res,data){
	var selectSQL;
	if(data.attr){
		selectSQL=`select id,niname,headImg,temContent,title,time from article,manager where article.username='${data.username}' and manager.username='${data.username}' order by id desc` //两表查询
	}else if(data.num){
		selectSQL=`select id,niname,headImg,temContent,title,time from article,manager where article.username=manager.username order by id desc limit ${data.num}` //两表查询
	}else{
		selectSQL=`select id,niname,headImg,temContent,title,time from article,manager where article.username=manager.username order by id desc` //两表查询
	}
  mydb.query(selectSQL,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
      	var rowsData=rows;
      	for(var i=0;i<rows.length;i++){
      		if(rows[i].headImg){
      			rowsData[i].headImg=`http://www.lazyzoe.cn/myblog/img/${rows[i].headImg}`
      		}else{
      			rowsData[i].headImg='http://www.lazyzoe.cn/myblog/images/user.png'
      		}
      		
      	}
      	console.log(rowsData)
      	//rows.headImg=`http://www.lazyzoe.cn/myblog/img/${rows.headImg}`
        res.json(rowsData)
      }

  });
}

function articleDetailsGet(req,res,data){
  var selectSQL=`select niname,headImg,title,time,content from article,manager where article.username=manager.username and id=?`
  mydb.query(selectSQL,data.id,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
      	var rowsData=rows;
      	for(var i=0;i<rows.length;i++){
      		if(rows[i].headImg){
      			rowsData[i].headImg=`http://www.lazyzoe.cn/myblog/img/${rows[i].headImg}`
      		}else{
      			rowsData[i].headImg='http://www.lazyzoe.cn/myblog/images/user.png'
      		}
      		
      	}
        res.json(rowsData)
      }
  });
}

function articleDelete(req,res,data){
  var selectSQL=`delete from article where id=${data.id}`
  mydb.query(selectSQL,data,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
      	res.json({
      		status:200,
      		msg:'删除成功'
      	})
      }
  });
}

function articleUpdate(req,res,data){
	console.log("title:"+data.title)
	console.log("temContent:"+data.temContent)
	console.log("content:"+data.content)
	console.log("id:"+data.id)
  var selectSQL=`UPDATE article SET title='${data.title}', temContent='${data.temContent}', content='${data.content}' where id=${data.id}`
  mydb.query(selectSQL,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
      	res.sendStatus(200)
      }
  });
}


module.exports = router