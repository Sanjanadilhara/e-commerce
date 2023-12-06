const {MongoClient,  ObjectId}  = require('mongodb');



class Users{

    constructor(){
        this.users=[];
      
    }

    add(obj){
        let temUsers=new Object();

        let temkeys=['email', 'password', '_id', 'firstName', 'lastName'];
        for(const [key, value] of Object.entries(obj)){
            if(temkeys.includes(key)){
                if((key=='_id') &&  typeof value == 'string'){
                   temUsers[key]=new ObjectId(value); 
                }
                else{
                    temUsers[key]=value;
                }
            }
        }
        this.users.push(temUsers);
    }


    retriveusers(qry, execUpdated, execAllUpdated){
        qry.toArray().then((data)=>{
            data.forEach((item)=>{
                this.add(item);
                execUpdated(true, this.users[this.users.length-1]);
            });
            execAllUpdated(true);
        }).catch((res)=>{execAllUpdated(false);});

    }

    updateDataBase(db, resExec){
        this.users.forEach((item)=>{
            if(item?.email !=undefined && item?.password !=undefined && item?.firstName !=undefined && item?.lastName !=undefined){
                if(item?._id===undefined){
                    item.date=new Date();
                    db.collection("users").insertOne(item).then((res)=>{
                        resExec(true, item);
                    }).catch((err)=>{
                        console.log("fail to insert data", item);
                        resExec(false, item);
                    });
                }else{
                    let setData={firstName:item.firstName, lastName:item.lastName, password:item.password};
                    db.collection("users").updateOne({_id:item._id}, {$set:setData}).then((res)=>{
                        resExec(true, item);
                    }).catch((err)=>{
                        console.log("fail to update data", item);
                        resExec(false, item);
                    });
                }
            }
            else{
                console.log("missing data", item);
                resExec(false, item);
            }
        });
    }
}

module.exports=Users;