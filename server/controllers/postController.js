const {MongoClient,  ObjectId}  = require('mongodb');
const bcrypt = require('bcrypt');
const Post=require('../models/post');

class PostController{
    static POST_ADDED_SUCCESS={success:true, status:"post added succesfully"};
    static POST_ADDED_UNSUCCESS={success:false, status:"couldn't add post"};
    static POST_FOUND={success:true, status:"post found"};
    static POST_NOT_FOUND={success:false, status:"no posts found"};
    static POSTS_NOT_FOUND_ERR={success:false, status:"error while finding posts"};
    static POST_UPDATED_SUCCESS={success:true, status:"post updated successfully"};
    static POST_UPDATE_FAIL={success:false, status:"fail to update the post"};
    static POST_UPDATE_FAIL={success:false, status:"fail to update the post"};
    static INVALID_POST_DATA={success:false, status:"invalid post data"};
    constructor(db){
        this.db=db;
        this.postsDB=this.db.collection('posts');
        this.logs=new Array();
        this.logs.peek=function(){
            return this.length==0?undefined:this[this.length-1];
        }

    }

    async addPost(post){
        try{
            if(post.logs.peek().success){
                delete post?.logs;
                let res=await this.postsDB.insertOne(post);
                if(res.acknowledged){
                    this.logs.push({...PostController.POST_ADDED_SUCCESS, id:res.insertedId});
                    
                }
                else{
                    this.logs.push(PostController.POST_ADDED_UNSUCCESS);
                }
            }
            else{
                this.logs.push(PostController.INVALID_POST_DATA);
            }
        }
        catch(e){
            this.logs.push(PostController.POST_ADDED_UNSUCCESS);
        }
    }

    async retrievePost(post){
        try{
            let postsArray=await this.postsDB.find(post).toArray();
            if(postsArray.length != 0){
                this.logs.push(PostController.POST_FOUND)
                return postsArray;
            }else{
                this.logs.push(PostController.POST_NOT_FOUND);
                return new Array();
            }
        }catch(e){
            console.log(e);
            this.logs.push(PostController.POSTS_NOT_FOUND_ERR);
            return new Array();
        }
     
    }


    async findPostById(id){
        try{
            let retPost=new Post();
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

    async updatePost(post){
        try{
            let temPost={...post};
            delete temPost?._id;
            delete temPost?.logs;

            let res=undefined;
            if(post?._id==undefined){
                this.logs.push(PostController.POST_UPDATE_FAIL);
            }else{
                res=await this.postsDB.updateOne({_id:post._id}, {$set:temPost});
            }
            res?this.logs.push(PostController.POST_UPDATED_SUCCESS):this.logs.push(PostController.POST_UPDATE_FAIL);
        }
        catch(e){
            this.logs.push(PostController.POST_UPDATE_FAIL)
        }
    }
}


module.exports=PostController;