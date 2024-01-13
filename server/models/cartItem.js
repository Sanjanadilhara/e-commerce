const {MongoClient,  ObjectId}  = require('mongodb');
const bcrypt = require('bcrypt');


class CartItem{
    constructor(body){
        if(body!=undefined){

            this.item=undefined;
            this.user=undefined;
            this.quantity=undefined;
            this.price=undefined;
            let temProps={item:'string', user:'string', quantity:'number'};
            let count=0;
            for(const [key, value] of Object.entries(body)){
                if(temProps.hasOwnProperty(key) && typeof value==temProps[key]){
                    if(key=='item'||key=='user'){
                        try{
                            this[key]=new ObjectId(value);
                        }catch(e){
                            throw JSON.stringify({success:false, status:"invalid data"});
                        }
                    }
                    else{
                        this[key]=value;
                    }
                    count++;
                }
            }
            if(count!=3){
                throw JSON.stringify({success:false, status:"missing data"});
            }

        }
        else{
            throw JSON.stringify({success:false, status:"no data"});

        }

    }
}

module.exports=CartItem;