const {MongoClient,  ObjectId}  = require('mongodb');
const bcrypt = require('bcrypt');


class Post{
    static POST_PARSE_SUCCESS={success:true, status:"post parse success"};
    static POST_PARSE_FAIL={success:false, status:"post parse fail"};
    constructor(body){



        this.logs=new Array();
        this.logs.peek=function(){
            return this.length==0?undefined:this[this.length-1];
        }

        if(body!=undefined){

            this.title=undefined;
            this.description=undefined;
            this.category=undefined;
            this.images=undefined;
            this.price=undefined;
            this.postedBy=undefined;
            let temkeys=['title', 'description', 'category', 'price', 'images', 'postedBy'];
            let count=0;
            for(const [key, value] of Object.entries(body)){
                if(temkeys.includes(key)){
                    this[key]=value;
                    count++;
                }
            }
            if(count==6){
                this.postedBy=new ObjectId(this.postedBy);
                this.logs.push(Post.POST_PARSE_SUCCESS);
            }
            else{
                this.logs.push(Post.POST_PARSE_FAIL);
            }

        }

    }

}


module.exports=Post;