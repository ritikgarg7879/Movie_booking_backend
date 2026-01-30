const Theatre=require('../models/theatre.model')

/**
 * 
 * @param data -> Objects containig details of the new theatre created 
 * @returns -> return the new theatre object created
 */


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

/**
 * 
 * @param id -> id which will be used to identify the theatre to be deleted
 * @returns -> object containing details of the theatre deleted
 */


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

/**
 * 
 * @param id ->id which will be used to identify the theatre to be fetched
 * @returns ->object containg theatre fetched
 */


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

/**
 * @param data -> the data to be used to filter out theatres basee on city/pincode
 * @returns ->return an object with the filtered content of theatres
 */

const getAllTheatre=async(data)=>{
  // try {
  //   const response=await Theatre.find({});
  //   return response;
  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
  try {
    let query={};
    let pagination={};
    if(data &&  data.city){
      //this check whether the city is present in the query params or not
      query.city=data.city;
    } 
    if(data && data.pincode){
      //this check whether the pincode is present in the query params or not
      query.pincode=data.pincode;
    }
    if(data && data.name){
      //this check whether the name is present in the query params or not
      query.pincode=data.pincode;
    }


    //It is used to show the first recorda that we have set like 5
    //So it will show first 5 records
    if(data && data.limit){
      pagination.limit=data.limit;
    }

    //Now suppose we want to skip start 5 records and show next 5 records on next page so skip is used 
    if(data && data.skip){
      let perPage=(data.limit)?data.limit:3;
      pagination.skip=data.skip*perPage;
    }

    //Before
    // const response=await Theatre.find(query);

    //After applying pagination concept
    // console.log("Query:", query);
    // console.log("Pagination:", pagination);

    const response=await Theatre.find(query,{},pagination);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * 
 * @param  id-> the unique id to identify the theatre to be udpdated 
 * @param  data ->data object to be used to update the theatre
 * @returns ->it return the new updated theatre object
 */

const updateTheatre=async(id,data)=>{
  try {
    const response=await Theatre.findByIdAndUpdate(id,data,{new:true,runValidators:true});
    if(!response){
      return {
        err:"No theatre found for the given id",
        code:404
      }
    }
    return response;
  } catch (error) {
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

module.exports={createTheatre,deleteTheatre,getTheatre,getAllTheatre,updateTheatre};