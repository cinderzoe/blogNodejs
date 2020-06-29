const express = require(`express`)
const server=express();
const router = express.Router()
var mysql = require('mysql');
var linksql = require('../linksql');
const mydb = linksql.db;  
var jwt = require('jsonwebtoken');
var multer  = require('multer')
const cookieParser = require('cookie-parser');
var fs = require("fs");
var path = require("path");

router.post('/updateSelfInfo', function(req, res,next) { 
  var params = req.body
  updateSelfInfo(req,res,params)
})

router.post('/getSelfInfo', function(req, res,next) { 
  var params = req.body
  getSelfInfo(req,res,params)
})

function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            //console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}

//递归创建目录 同步方法
function mkdirsSync(dirname) {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        mkdirsSync(folder);
    }
};

var uploadFolder = 'C:/inetpub/wwwroot/myblog/img';
var src='';
createFolder(uploadFolder);


// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, Math.floor(Date.now()/1000)+'_'+file.originalname);
        src = '/upload/img/'+Math.floor(Date.now()/1000)+'_'+file.originalname;
        console.log(src)
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

router.post('/updateHeadPic',upload.single('file'),function(req,res,next){

    // var mood_info = req.body;
    //res.sendFile(__dirname +'/../'+ req.file.path );
    //console.log(__dirname +'../'+ req.file.path )
    
    console.log(req.body)
    console.log(req.file.filename)
  var selectSQL=`UPDATE manager SET headImg='${req.file.filename}' where username='${req.body.username}'`
  mydb.query(selectSQL,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
        res.json({
          pic:`http://www.lazyzoe.cn/myblog/img/${req.file.filename}`
        })
      }

  });

})

// const createFolder = function(folder){
//     try {
//         fs.accessSync(folder)
//     } catch(e) {
//         fs.mkdirSync(folder)
//     }
// }
// const uploadFolder = './upload/'
// createFolder(uploadFolder)
// // 通过 filename 属性定制
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadFolder) // 保存的路径
//     },
//     filename: function (req, file, cb) {
//         // 将保存文件名设置为 字段名 + 时间戳 + 后缀名
//         let fileFormat = (file.originalname).split('.')
//         cb(null, file.fieldname + '-' + Date.now()) + '.' + fileFormat[fileFormat.length - 1]
//     }
// })
// const upload = multer({ storage: storage })
// router.post('/updateHeadPic', upload.single('file'), function (req, res, next) {
//     const file = req.file
//     console.log(file)
//     //console.log(file)
//     res.send({ code: 200 })
// })
// const upload = multer({ storage: storage })
// var objMulter=multer({dest: './uploadImages'}); //设置上传的的图片保存目录
// server.use(objMulter.any());
// router.post('/updateHeadPic', function(req, res,next) { 
//   var params = req.body
//   updateHeadPic(req,res,params)
// })



// router.post('/updateHeadPic',objMulter.single('avatar'),function(req,res,next){
//     console.log(req.body,req.file)
//     res.send({
//         code:1,
//         msg:'成功'
//     })
// })

function updateSelfInfo(req,res,data){
  var selectSQL=`UPDATE manager SET ${data.attribute}='${data.content}' where username='${data.username}'`
  console.log(data.username)
  mydb.query(selectSQL,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
        res.sendStatus(200)
      }

  });
}


function getSelfInfo(req,res,data){
  var selectSQL=`select niname,introduction,headImg from manager where username='${data.username}'`
  mydb.query(selectSQL,function(err, rows) {  //connection.query是查询数据库的API
      if (err){console.log(err)}
      else{
        var rowsData=rows;
        console.log(rows.length)
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

// function updateHeadPic(req,res,data){
//   // var selectSQL=`select niname,introduction from manager where username='${data.username}'`
//   // mydb.query(selectSQL,function(err, rows) {  //connection.query是查询数据库的API
//   //     if (err){console.log(err)}
//   //     else{
//   //       res.json(rows)
//   //     }

//   // });
  

// }


module.exports = router