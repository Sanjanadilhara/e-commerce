const express = require('express');
const ws = require('ws');
const http=require('http');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
const {MongoClient,  ObjectId}  = require('mongodb');
const e = require('express');
const users=require('./models/user');






const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let db=undefined;

client.connect().then((result) => {
  db=client.db('eCommerce');
  console.log(`succesfully connected to db ${url} `);
  
}).catch((err) => {
  console.log(`can't connect to ${url}`);
});

app.get('/', function (req, res) {
  jwt.verify(req.cookies.auth, 'instmsg098', function(err, decoded) {
    if(!err){
      let idob=new ObjectId(decoded.id);
      db.collection('users').find({ _id:idob}).toArray().then((data)=>{
        res.json({status:1, name:`${data[0]["firstName"]} ${data[0]["lastName"]}`})
      }).catch((err)=>{
        res.json({status:-1});
      });
    } 
    else{
      res.json({status:-1});
    }
  });
});


app.post('/signup', function(req, res){
  // console.log(req.body.email);
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    

    let userData=new users();
    req.body.password=hash;
    userData.add(req.body);
    userData.updateDataBase(db, (success, item)=>{
      if(success){
        res.json({status:1});
      }
      else{
        res.json({status:0});
      }
    });

  });
});

app.post('/login', function(req, res){
  
  // let ob=new ObjectId(req.body.email);
  db.collection('users').find({ email:req.body.email }).toArray().then((data)=>{

    bcrypt.compare(req.body.password, data[0]["password"], function(err, result) {

      if(result==true){
        let token = jwt.sign({ id: data[0]["_id"].toString() }, 'instmsg098');
        res.cookie("auth", token);
        res.json({status:1});
      }
      else{
        res.json({status:-2});
      }
    }); 
  }).catch((err)=>{
    res.json({status:-1});
  });

  
});

// app.listen(80,  function(){
//     console.log("listening on 80");
// });





server.listen(80)