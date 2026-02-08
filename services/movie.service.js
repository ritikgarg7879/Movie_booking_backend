const Movie=require('../models/movie.model');
const {STATUS}=require('../utils/constants');
const redis = require('../config/redis');



const clearMovieCache = async () => {
  const keys = await redis.keys("movies:*");

  if (keys.length > 0) {
    await redis.del(keys);
    console.log("🗑 Movie cache cleared");
  }
};

/**
 * 
 * @param data -> Objects containig details of the new movie created 
 * @returns -> return the new movie object created
 */

const createMovie=async(data)=>{
  try{
    const movie=await Movie.create(data);

    await clearMovieCache(); //cache

    return movie;
  }catch(error){
    if(error.name == 'ValidationError'){
        let err={};
        Object.keys(error.errors).forEach((key)=>{
          err[key]=error.errors[key].message;
        });
        throw {
          err:err,
          code:STATUS.UNPROCESSABLE_ENTITY
        }
    }else{
      throw error;
    }
  }
}

/**
 * 
 * @param id -> id which will be used to identify the movie to be deleted
 * @returns -> object containing details of the movie deleted
 */



const deleteMovie = async (id) => {

  const movie = await Movie.findByIdAndDelete(id);

  if (!movie) {
    throw {
      err: "No movie record found",
      code: STATUS.NOT_FOUND
    };
  }

  await clearMovieCache();// cache

  return movie;
};

/**
 * 
 * @param id ->id which will be used to identify the movie to be fetched
 * @returns ->object containg movie fetched
 */


const getMovieById=async(id)=>{
  const movie= await Movie.findById(id);
  if(!movie){
    throw {
      err:"No movie found for the corresponding id provided",
      code:STATUS.NOT_FOUND,
      message:"Something went wrong, unable to fetch the movie",
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

// const updateMovie=async (id,data)=>{
//   try{
//   const movie=await Movie.findByIdAndUpdate(id,data,{new:true,runValidators:true});
//   return movie;
//   }catch(error){
//     if(error.name == 'ValidationError'){
//         let err={};
//         Object.keys(error.errors).forEach((key)=>{
//           err[key]=error.errors[key].message;
//         });
//         console.log(err);
//         throw {
//           err:err,
//           code:STATUS.UNPROCESSABLE_ENTITY
//         };
//     }else{
//         throw error;
//     }
//   }
// }

const updateMovie = async (id, data) => {
  try {

    const movie = await Movie.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!movie) {
      throw {
        err: "No movie found",
        code: STATUS.NOT_FOUND
      };
    }

    await clearMovieCache();

    return movie;

  } catch (error) {

    if (error.name == 'ValidationError') {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });

      throw {
        err: err,
        code: STATUS.UNPROCESSABLE_ENTITY
      };
    }

    throw error;
  }
};


/**
 * 
 * @param filter-> filter will help us in filtering out data based on the conditionals 
 * @returns ->return an object containg all the movies fetched based on the filter
 */

// const fetchMovies=async(filter)=>{
//   let query={};
//   if(filter.name){
//     query.name=filter.name;
//   }
//   let movies=await Movie.find(query)
//   if(!movies){
//     throw {
//       err:"Not able to find the queries movies",
//       code: STATUS.NOT_FOUND
//     }
//   }
//   return movies;can
// }

const fetchMovies = async (filter) => {

  const cacheKey = `movies:${JSON.stringify(filter)}`;

  // 1️⃣ Check Redis
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("⚡ Serving Movies from Cache");
    return JSON.parse(cachedData);
  }

  // 2️⃣ If not in cache → fetch from DB
  let query = {};
  if (filter.name) {
    query.name = filter.name;
  }

  const movies = await Movie.find(query);

  // 3️⃣ Store in Redis (TTL 60 seconds)
  await redis.set(cacheKey, JSON.stringify(movies), "EX", 60);

  return movies;
};


module.exports={createMovie,getMovieById,deleteMovie,updateMovie,fetchMovies}