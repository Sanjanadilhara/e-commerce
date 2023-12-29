const {MongoClient,  ObjectId}  = require('mongodb');
const bcrypt = require('bcrypt');


class User{
    static USER_PARSE_SUCCESS={success:true, status:"user parse success"};
    static USER_PARSE_FAIL={success:false, status:"user parse fail"};
    static USER_PARSE_MISSING_DATA={success:false, status:"missing some data for user"};
    static PASSWORD_HASH_FAIL={success:false, status:"fail to hash password"};
    static PASSWORD_HASH_SUCCESS={success:true, status:"password hash successfull"};
    static PASSWORD_COMPARE_SUCCESS={success:true, status:"password matches"};
    static PASSWORD_COMPARE_FAIL={success:false, status:"password doesn't match"};
    constructor(body){



        this.logs=new Array();
        this.logs.peek=function(){
            return this.length==0?undefined:this[this.length-1];
        }

        if(body!=undefined){

            this.email=undefined;
            this.password=undefined;
            this.firstName=undefined;
            this.lastName=undefined;
            let temkeys=['email', 'password', 'firstName', 'lastName'];
            let count=0;
            for(const [key, value] of Object.entries(body)){
                if(temkeys.includes(key)){
                    this[key]=value;
                    count++;
                }
            }
            if(count==4){
                this.logs.push(User.USER_PARSE_SUCCESS);
            }
            else{
                this.logs.push(User.USER_PARSE_MISSING_DATA);
            }

        }

    }
    comparePassword(password){
        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, this.password, (err, result)=>{
                if(!err && result){
                    this.logs.push(User.PASSWORD_COMPARE_SUCCESS);
                    resolve();
                }
                else{
                    this.logs.push(User.PASSWORD_COMPARE_FAIL);
                    resolve();
                }
            });
        });
    }
    hashPassword(){
        let logs=this.logs;
        return new Promise((resolve, reject)=>{

            bcrypt.hash(this.password, 10, async (err, hash)=> {
                try{
                    console.log(this);
                    if(!err){
                        this.password=hash;
                        this.logs.push(User.PASSWORD_HASH_SUCCESS);
                        resolve();
                    }
                    else{
                        this.logs.push(User.PASSWORD_HASH_FAIL);
                        resolve()
                    }
                }
                catch(e){
                    this.logs.push(User.PASSWORD_HASH_FAIL);
                    resolve();
                }
            
            });
        });
    }

}


module.exports=User;