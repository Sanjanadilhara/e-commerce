const {MongoClient,  ObjectId}  = require('mongodb');
const bcrypt = require('bcrypt');
const CartItem=require('../models/cartItem');
const Post = require('../models/post');
const PostController = require('./postController');


class CartItemController{
    constructor(db){
        this.db=db;
        this.cartItemDB=this.db.collection('cartItem');
        if(db===undefined){
            throw JSON.stringify({success:false, status:"invalid databse connection"});
        }
    }

    async addCartItem(cartItem){
        if(this.cartItemDB===undefined){
            throw JSON.stringify({success:false, status:"database connection error"});
        }
        if(cartItem instanceof CartItem){
            let postCtr=new PostController(this.db);
            let post=await postCtr.findPostById(cartItem.item);

            if(post===undefined){
                throw JSON.stringify({success:false, status:"invalid data encountered"});
            }
            cartItem.price=post.price*cartItem.quantity;

            let res=await this.cartItemDB.insertOne(cartItem);
            if(res.acknowledged){
                return res.insertedId;
            }
            else{
                throw JSON.stringify({success:false, status:"could not add to the database"});
            }
        }
        else{
            throw JSON.stringify({success:false, status:"invalid data"});
        }
      
    }

    async retrieveCartOf(userId){
            let postsArray;
            try{
                postsArray=await this.cartItemDB.aggregate([
                    {$match:
                        {
                            user:new ObjectId(userId)
                        }
                    },
                    {$lookup:
                        {
                            from: 'posts',
                            localField: 'item',
                            foreignField: '_id',
                            as: 'post'
                        }
                    },
                    {$unwind:
                        {
                            path: '$post'
                        }
                    },
                    {$group:
                        {
                            _id: null,
                            items:{$push:'$$ROOT'},
                            total:{$sum:'$price'}
                        }
                    }
                ]).toArray();

                console.log(postsArray);
            }catch(e){
                throw JSON.stringify({success:false, status:"user Id is invalid"});
            }
            if(postsArray.length != 0){

                return postsArray[0];
            }else{
                throw JSON.stringify({success:false, status:"no items found"});
            }

     
    }


    async findPostById(id){
        try{
            let retPost=new cartItem();
            let res= await this.retrievePost({_id:new ObjectId(id)});
            if(res[0]!=undefined){
                for(const [key, value] of Object.entries(res[0])){
                    retPost[key]=value;
                }
                return retPost;
            }
            else{
                return undefined
            }

        }
        catch(e){
            return undefined;
        }

    }

    async updatePost(cartItem){
        try{
            let temPost={...cartItem};
            delete temPost?._id;
            delete temPost?.logs;

            let res=undefined;
            if(cartItem?._id==undefined){
                this.logs.push(PostController.POST_UPDATE_FAIL);
            }else{
                res=await this.cartItemDB.updateOne({_id:cartItem._id}, {$set:temPost});
            }
            res?this.logs.push(PostController.POST_UPDATED_SUCCESS):this.logs.push(PostController.POST_UPDATE_FAIL);
        }
        catch(e){
            this.logs.push(PostController.POST_UPDATE_FAIL)
        }
    }
    async searchPosts(keys){
        try{
            let regString=keys.split(" ").join("|");
            let regExpObj=new RegExp(regString, 'i');
            let result=await this.cartItemDB.aggregate([
                {
                  $addFields:
                  {
                    searchstr:{$concat:['$title', ' ', '$description']}
                  }  
                },
                {$match:
                    {
                        searchstr: {
                          $regex: regExpObj,
                        },
                    }
                },

                {
                    $addFields:
                    {
                        matches: {
                          $size: {
                            $regexFindAll: {
                              input: "$searchstr",
                              regex: regString,
                              options: "i",
                            },
                          },
                        },
                      }
                },

                {
                    $sort:
                    {
                        matches: -1,
                    }
                }
            ]).toArray();


            if(result.length==0){
                throw "no result found";
            }
            
            return {success:true, posts:result};
        }
        catch(e){
            return {success:false, status:e.toString()};
        }

    }
}


module.exports=CartItemController;