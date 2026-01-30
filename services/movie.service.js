const Movie=require('../models/movie.model')


/**
 * 
 * @param data -> Objects containig details of the new movie created 
 * @returns -> return the new movie object created
 */

const createMovie=async(data)=>{
  try{
    const movie=await Movie.create(data);
    return movie;
  }catch(error){
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
 * @param id -> id which will be used to identify the movie to be deleted
 * @returns -> object containing details of the movie deleted
 */



const deleteMovie=async(id)=>{
  try {
    const movie=await Movie.findByIdAndDelete(id);
    if(!response){
      return {
        err:"No movie record found for the id provided",
        code:404
      }
    }
    return movie;
  } catch (error) {
    console.log(error);
    throw error;
  }
  
}

/**
 * 
 * @param id ->id which will be used to identify the movie to be fetched
 * @returns ->object containg movie fetched
 */


const getMovieById=async(id)=>{
  const movie= await Movie.findById(id);
  if(!movie){
    return{
      err:"No movie found for the corresponding id provided",
      code:404,
      message:"Something went wrong,unable to fetch the movie",
      data:{}
    }
  };
  return movie;
}

/**
 * 
 * @param  id -> id which will be used to identify the movie to be updated
 * @param  data -> object that contains actual data which is to be updated in the db
 * @returns -> return the new updated movie details
 */

const updateMovie=async (id,data)=>{
  try{
  const movie=await Movie.findByIdAndUpdate(id,data,{new:true,runValidators:true});
  return movie;
  }catch(error){
    if(error.name == 'ValidationError'){
        let err={};
        Object.keys(error.errors).forEach((key)=>{
          err[key]=error.errors[key].message;
        });
        console.log(err);
        return {err:err,code:422};
    }else{
        throw error;
    }
  }
}


/**
 * 
 * @param filter-> filter will help us in filtering out data based on the conditionals 
 * @returns ->return an object containg all the movies fetched based on the filter
 */

const fetchMovies=async(filter)=>{
  let query={};
  if(filter.name){
    query.name=filter.name;
  }
  let movies=await Movie.find(query)
  if(!movies){
    return {
      err:"Not able to find the queries movies",
      code: 404
    }
  }
  return movies;
}


module.exports={createMovie,getMovieById,deleteMovie,updateMovie,fetchMovies}