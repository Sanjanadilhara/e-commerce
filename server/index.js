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
const CartItem=require('./models/cartItem.js');
const CartItemController=require('./controllers/CartItemController.js')
const stripe = require("stripe")('sk_test_51OJLnxDB5ydFCTRnsen4HUdRgZURdCZcptz3ura6BFk1gDZx6mhBlwBbyH56jyuKxGf1Nuk1z5Y7Ae8pW3z4SO7p00qPbEH6ME');
const nodemailer = require("nodemailer");
require('dotenv').config();



const temRegUsers=new Map();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "forwpurpose@gmail.com",
    pass: "kfnnxfqnpkwtzryk",
  },
});

const upload = multer({ dest: 'uploads/' })

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//   origin: 'http://192.168.189.21:5173', 
//   credentials: true,
// }));
app.use(cors({
  origin: process.env.CORS_URL, 
  credentials: true,
}));
app.use(function(req, res, next){
  jwt.verify(req?.cookies?.auth, process.env.JWT_KEY, function(err, decoded) {
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

const url = process.env.DB_URL;
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
    if(await userController.findUserByEmail(user.email)===undefined){
      await user.hashPassword();
      temRegUsers.set(user.email, user);

      let token = jwt.sign({ email:user.email}, process.env.JWT_KEY);
      const info = await transporter.sendMail({
        from: 'e-commerce', // sender address
        to: user.email, // list of receivers
        subject: "e-commerce", // Subject line
        text: "confirm your account", // plain text body
        html: `<a href='${process.env.HOST}/activate/${token}'><button>confirm</button></a>`, // html body
      });

      setTimeout(()=>{
        console.log("deleting "+user.email);
        if(temRegUsers.has(user.email)){
          temRegUsers.delete(user.email);
        }
      }, 60000);
      res.json({success:true, status:"check emails"});

    }
    else{
      res.json({success:false, status:"email already exist"});
    }
    // await userController.addUser(user);
  }
  else{
    res.json(user.logs.pop());
  }
});
app.get("/activate/:key", async function(req, res){
  jwt.verify(req.params.key, process.env.JWT_KEY, async function(err, decoded) {
    if(!err){
      if(temRegUsers.has(decoded.email)){
        let user=temRegUsers.get(decoded.email);
        let userController=new UserController(db);

        await userController.addUser(user);

        if(userController.logs.pop().success){
          temRegUsers.delete(user.email);
          res.redirect(`${process.env.CORS_URL}/login`);
        }
        else{
          res.send(`error activating your account <a href="${process.env.CORS_URL}/signup">signup</a>`);
        }
      
      }
      else{
        res.send(`timeout <a href="${process.env.CORS_URL}/signup">signup</a>`);
      }

    }
    else{
      res.send("error while activating your accout");
    }
  });
});

app.post('/login', async function(req, res){
  
  let userController=new UserController(db);
  let user= await userController.findUserByEmail(req.body?.email);
  if(user!=undefined){
    await user.comparePassword(req.body?.password);
    if(user.logs.peek().success ){
      let token = jwt.sign({ id:user._id}, process.env.JWT_KEY);
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

app.get('/post/:postId', async function(req, res){

  console.log(req.params.postId);
  let postController=new PostController(db);
  let post=await postController.findPostById(req.params.postId);
  if(post===undefined){
    res.json({success:false, status:"post not found"});
  }
  else{
    delete post?.logs;
    res.json(post);
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

  if(req.isAuthorized){
    try{
      res.sendFile(process.env.UPLOAD_DIRECTORY+req.params.filename);
    }catch(e){
      res.json({success:false, status:e.toString()})
    }

  }
  else{
    res.end();
  }
  //   fs.readFile("uploads/"+req.params.filename, function(err, data) {
  //     res.send(data);
  // });
});

app.get('/search/:query', async function(req, res){
  let postController=new PostController(db);
  let result=await postController.searchPosts(req.params.query);
  res.json(result);
});

app.post("/cartitem", async function(req, res){
  try{
    if(req.isAuthorized){
      let cartItemController=new CartItemController(db);

      req.body.user=req.userID;
      let cartItem=new CartItem(req.body);
      let result=await cartItemController.addCartItem(cartItem);
      res.json({success:true, status:"cart item added succesfully"});
    }
    else{
      res.json({success:false, status:"not authorized"});
    }
  }catch(e){
    console.log(e);
    res.send(e);
  }
});
app.delete("/cartitem", async function(req, res){
  try{
    if(req.isAuthorized){
      let cartItemController=new CartItemController(db);

      let result=await cartItemController.deleteCartItem(req.body?.item);
      res.json({success:true, status:"cart item deleted succesfully"});
    }
    else{
      res.json({success:false, status:"not authorized"});
    }
  }catch(e){
    console.log(e);
    res.send(e);
  }
});
app.get('/cart', async function(req, res){
  try{
    if(req.isAuthorized){
      let cartItemController=new CartItemController(db);
      let data=await cartItemController.retrieveCartOf(req.userID);
      res.json(data);
    }
    else{
      res.json({success:false, status:"not authorized"});
    }

  }catch(e){
    res.json({success:false, status:e.toString()});
  }
});

// app.listen(80,  function(){
//     console.log("listening on 80");
// });

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log(items);
  if(req.isAuthorized){
    let cartItemController=new CartItemController(db);
    let data=await cartItemController.retrieveCartOf(req.userID);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.total*100,
      currency: "LKR",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
      total:data.total,
    });

  }
  else{
    res.json({success:false, status:"not authorized"});
  }
});


server.listen(80)