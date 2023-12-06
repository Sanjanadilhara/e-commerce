const {MongoClient,  ObjectId}  = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let db=undefined;



client.connect().then((result) => {
  db=client.db('instmsg');
  console.log(`succesfully connected to db ${url} `);
  db.collection("messages").aggregate([
    {
      $group: {
        _id: '$from',
        totalAmount: { $sum: '$sent' },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]).toArray().then((arr)=>{
    console.log(arr);
  });

  
}).catch((err) => {
  console.log(`can't connect to ${url}`);
});