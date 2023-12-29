
async function ss(p){
  return new Promise((resoleve, regect)=>{
    setTimeout(()=>{
      if(p){
        resoleve();
      }
      else{
        regect()
      }

    }, 1000)
  });
}


async function wi(){
  try{

    await ss(false);
    return "yes";
  }
  catch(e){
    console.log("ss fails");
    console.log("ss executed");
    return "no ";
  }
}

async function upper(){
  let vv=await wi();
  console.log("wi executed: ret"+ vv);
  return true;
}


console.log(upper());