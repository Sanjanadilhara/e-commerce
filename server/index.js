const express = require('express');
const ws = require('ws');
const http=require('http');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
const {MongoClient,  ObjectId}  = require('mongodb');
const e = require('express');
const User=require('./models/user');
const UserController=require('./controllers/userController');
const PostController=require('./controllers/postController.js');
const multer  = require('multer');
const fs = require('fs');
const Post = require('./models/post.js');



const upload = multer({ dest: 'uploads/' })



const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(function(req, res, next){
  jwt.verify(req?.cookies?.auth, 'instmsg098', function(err, decoded) {
    if(!err){
      req.isAuthorized=true;
      req.userID=decoded.id;
      next();
    } 
    else{
      req.isAuthorized=false;
      next();
    }
  });
});

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let db=undefined;

client.connect().then((result) => {
  db=client.db('eCommerce');
  console.log(`succesfully connected to db ${url} `);
  
}).catch((err) => {
  console.log(`can't connect to ${url}`);
});

app.get('/', async function (req, res) {
  let userctr=new UserController(db);
  if(req.isAuthorized){
    let user=await userctr.findUserById(req.userID);
    if(userctr.logs.pop().success){
      delete user?._id;
      delete user?.password;
      delete user?.logs;
      res.json(user)
    }
    else{
      res.json(userctr.logs.pop());
    }
  }
  else{
    res.json({success:false, status:"user not authorized"});
  }
});


app.post('/signup', async function(req, res){
  let user=new User(req.body);
  let userController=new UserController(db);
  if(user.logs.peek().success){
    await user.hashPassword();
    await userController.addUser(user);
    res.json(userController.logs.pop());
  }
  else{
    res.json(user.logs.pop());
  }
});

app.post('/login', async function(req, res){
  
  let userController=new UserController(db);
  let user= await userController.findUserByEmail(req.body?.email);
  if(user!=undefined){
    await user.comparePassword(req.body?.password);
    if(user.logs.peek().success){
      let token = jwt.sign({ id:user._id}, 'instmsg098');
      res.cookie("auth", token);
      res.json(user.logs.pop());
    }
    else{
      res.json(user.logs.pop());
    }
  }
  else{
    res.json({success:false, status:"user not found"});
  }

  
});


app.post('/post-add',upload.array('images', 12), async function(req, res){
  try{
  if(req.isAuthorized){
    console.log(req.files);
    let data=undefined;
      data=await JSON.parse(req.body?.jsonData);
      data.images=new Array();
      data.postedBy=req.userID;
      
      for(const file of req.files){
        if(file.mimetype.startsWith("image")){
          let temFilePath=file.destination+file.filename+"."+file.originalname.split(".")[file.originalname.split(".").length-1];
          let temFileName=file.filename+"."+file.originalname.split(".")[file.originalname.split(".").length-1];
          fs.renameSync(file.path, temFilePath);
          data.images.push(temFileName);
        }
        else{
          fs.rm(file.path, (err)=>{});
        }
        
      }
      
      
      let post=new Post(data);
      let postController=new PostController(db);
      
      await postController.addPost(post);
      if(postController.logs.peek().success){
      res.json(postController.logs.pop());
    }
    else{
      res.json(postController.logs.pop());
    }
  }
  else{
    res.json({success:false, status:"not authorized"});
  }
  
}catch(e){
  res.json({success:false, status:"unknown error"});
}
});


app.get('/images/:filename',upload.array('images', 12), function(req, res){

    fs.readFile("uploads/"+req.params.filename, function(err, data) {
      res.send(data);
  });
});

// app.listen(80,  function(){
//     console.log("listening on 80");
// });





server.listen(80)