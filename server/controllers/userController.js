const {MongoClient,  ObjectId}  = require('mongodb');
const bcrypt = require('bcrypt');
const User=require('../models/user');

class UserController{
    static USER_ADDED_SUCCESS={success:true, status:"user added succesfully"};
    static USER_ADDED_UNSUCCESS={success:false, status:"couldn't add user"};
    static USER_ALREADY_EXIST={success:false, status:"user already exist with this email"};
    static USERS_FOUND={success:true, status:"users found"};
    static USERS_NOT_FOUND={success:false, status:"no users found"};
    static USERS_NOT_FOUND_ERR={success:false, status:"error while finding users"};
    static USERS_UPDATED_SUCCESS={success:true, status:"user updated successfully"};
    static USERS_UPDATE_FAIL={success:false, status:"fail to update the user"};
    constructor(db){
        this.db=db;
        this.userDB=this.db.collection('users');
        this.logs=new Array();
        this.logs.peek=function(){
            return this.length==0?undefined:this[this.length-1];
        }

    }

    async addUser(user){
        try{
            delete user?.logs;
            let existingUsers= await this.findUserByEmail(user.email);
            console.log(existingUsers);
            if(existingUsers===undefined && this.logs.peek()!=UserController.USERS_NOT_FOUND_ERR){
                let res=await this.userDB.insertOne(user);
                if(res.acknowledged){
                    this.logs.push(UserController.USER_ADDED_SUCCESS);
                }
                else{
                    this.logs.push(UserController.USER_ADDED_UNSUCCESS);
                }
            }
            else{
                this.logs.push(UserController.USER_ALREADY_EXIST);
            }
        }
        catch(e){
            this.logs.push(UserController.USER_ADDED_UNSUCCESS);
        }
    }

    async retriveUsers(user){
        try{
            let usersArray=await this.userDB.find(user).toArray();
            console.log("len: "+usersArray.length);
            if(usersArray.length != 0){
                this.logs.push(UserController.USERS_FOUND)
                return usersArray;
            }else{
                this.logs.push(UserController.USERS_NOT_FOUND);
                return new Array();
            }
        }catch(e){
            console.log(e);
            this.logs.push(UserController.USERS_NOT_FOUND_ERR);
            return new Array();
        }
     
    }


    async findUserById(id){
        let retUser=new User();
        let res= await this.retriveUsers({_id:new ObjectId(id)});
        if(res[0]!=undefined){
            for(const [key, value] of Object.entries(res[0])){
                retUser[key]=value;
            }
            return retUser;
        }
        else{
            return undefined
        }

    }
    async findUserByEmail(email){
        let retUser=new User();
        let res=await this.retriveUsers({email:email});
        if(res[0]!=undefined){
            for(const [key, value] of Object.entries(res[0])){
                retUser[key]=value;
            }
            return retUser;
        }
        else{
            return undefined;
        }
    }
    async updateUser(user){
        try{
            let temUser={...user};
            delete temUser?._id;
            delete temUser?.email;
            delete temUser?.logs;
            let res=await this.userDB.updateOne(user?._id==undefined?{email:user?.email}:{_id:user?._id}, {$set:temUser});
            res?this.logs.push(UserController.USERS_UPDATED_SUCCESS):this.logs.push(UserController.USERS_UPDATE_FAIL);
        }
        catch(e){
            this.logs.push(UserController.USERS_UPDATE_FAIL)
        }
    }
}


module.exports=UserController;