const Theatre=require('../models/theatre.model')

const createTheatre=async(data)=>{
  try{
      const response=await Theatre.create(data);
      return response;
  }catch(error){
      // console.log(err);
      // throw err;
      if(error.name == 'ValidationError'){
        let err={};
        Object.keys(error.errors).forEach((key)=>{
          err[key]=error.errors[key].message;
        });
        return {err:err,code:422};
      }else{
        console.log(err);
        throw error;
      }
  }
}


const deleteTheatre=async(id)=>{
  try{
  const response=await Theatre.findByIdAndDelete(id);
  if(!response){
      return {
        err:"No record of a theatre found for the given id",
        code:404
      }
  }
  return response;
  }
  catch(error){
    console.log(error);
    throw error;
  }
  
}


const getTheatre=async(id)=>{
  try {
  const response=await Theatre.findById(id);
  if(!response){
    return{
      err:"No theatre found for the given id",
      code:404
    }
  }
  return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
  
}

module.exports={createTheatre,deleteTheatre,getTheatre};