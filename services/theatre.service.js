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

    //IN this we pass the movieId and we are trying to get all the theatre in which particular movieId is present is getting listed
    if(data && data.movieId){
     // let movie=await Movie.findById(data.movieId);
      query.movies={$all:data.movieId};
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

/**
 * 
 * @param  theatreId -> UNique id of theatre fro which we want to update movies
 * @param  movieIds ->array of movie ids that are expected to be updated in theatre
 * @param  insert -> booolean that tells whether we want insert movies or remove them
 * @returns  -> updated theatre objects
 */



//Function to add and delete movie in a theatre
const updateMoviesInTheatres=async(theatreId,movieIds,insert)=>{

  // const theatre=await Theatre.findById(theatreId);
  // if(!theatre){
  //   return {
  //     err:"No such theatre found for the id provided",
  //     code:404
  //   };
  // }
 
  // if (insert) {
  //   // ADD movies
  //   movieIds.forEach(movieId => {
  //     if (!theatre.movies.includes(movieId)) {
  //       theatre.movies.push(movieId);
  //     }
  //   });
  // } else {
  //   // REMOVE movies 
  //   theatre.movies = theatre.movies.filter(
  //     existingMovieId =>
  //       !movieIds.includes(existingMovieId.toString())
  //   );

  // }

  //   const theatre=await Theatre.findById(theatreId);
  //   return theatre.populate('movies');

  // await theatre.save();
  // return theatre.populate('movies');


  // The problem with above functionality is they are adding same movie more than one time

    try{
    // if(insert){
    //   //we need to add movie
    //   await Theatre.updateOne(
    //     {_id: theatreId},
    //     {$addToSet:{movies:{$each: movieIds}}}
    //   );
    // }else{
    //   //we need to remove movie
    //   await Theatre.updateOne(
    //     {_id: theatreId},
    //     {$pull:{movies:{$in:movieIds}}}
    //   );
    // }
    // const theatre=await Theatre.findById(theatreId);
    // return theatre.populate('movies');

    //Problem with above is it is correct no problem
    //We are just reducing function call of theatre.
    //As well as updateOne doesn't return you the updated object
    //while findById return us the updated object
    //so we also including new so we get updated object instead of old object

    let theatre;
    if(insert){
      //we need to add movie  
      theatre = await Theatre.findByIdAndUpdate(
        {_id: theatreId},
        {$addToSet:{movies:{$each: movieIds}}},
        {new:true}
      );
    }else{
      //we need to remove movie
      theatre=await Theatre.findByIdAndUpdate(
        {_id: theatreId},
        {$pull:{movies:{$in:movieIds}}},
        {new:true}
      );
    }

    return theatre.populate('movies');

  }
  catch(error){
    if(error.name=="TypeError"){
      return {
        code:404,
        err:"No theatre found for the given id"
      }
    }
    console.log("Error is",error);
    throw error;
  }
}



//In this we are trying to get all movies in particular theatre
const getMoviesInATheatre=async(id)=>{
  try{
    //So with the help of this when we type thetare id so we will get all the movie id in that theatre
    //and with the help of populate we will get all the movies detail in particular theatre
    //with the help of this we are getting complete movie object


    const theatre=await Theatre.findById(id,{name:1,movies:1,address:1}).populate('movies'); 
    if(!theatre){
      return{
        err:"No theatre with the given id found",
        code:404
      }
    }
    return theatre;
  }catch(error){
    console.log(error);
    throw error;
  }
}

//Check movie in a theatre
const checkMovieInATheatre=async(theatreId,movieId)=>{
  try {
    let theatre=await Theatre.findById(theatreId);
    if(!theatre){
      return {
        err:"No such theatre found for the given Id",
        code:404
      };
    }
    return theatre.movies.includes(movieId);
  } catch (error) {
    console.log(error);
    throw error;
  }
}




module.exports={createTheatre,deleteTheatre,getTheatre,getAllTheatre,updateTheatre,updateMoviesInTheatres,getMoviesInATheatre,checkMovieInATheatre};