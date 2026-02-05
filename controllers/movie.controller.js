// const Movie=require('../models/movie.model')
const movieService=require('../services/movie.service')
const {successResponseBody,errorResponseBody}=require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

// const errorResponseBody={
//   err:{},
//   data:{},
//   message:"Something went wrong,cannot process the request",
//   success:false
// }

// const successResponseBody={
//   err:{},
//   data:{},
//   message:"Successfully processes the request",
//   success:true
// }



//Controller function to create new Movies 
const createMovie= async(req,res)=>{
  // console.log("Created Properly");
    // try{
    //   const movie= await Movie.create(req.body);
    //   return res.status(201).json({
    //     success:true,
    //     error:{},
    //     data:movie,
    //     message:"Successfully created a new movie",

    //   })
    // }
    // catch(err){
    //   console.log(err);
    //   return res.status(500).json({
    //     success:false,
    //     error:err,
    //     data:{},
    //     message:"Something went wrong"
    //   })
    // }

    try{
      // const movie= await Movie.create(req.body);
      const response= await movieService.createMovie(req.body);
      successResponseBody.data=response;
      successResponseBody.message="Successfully created the movie";
      return res.status(STATUS.CREATED).json(successResponseBody)
    }
    catch(error){
      if(error.err){
        errorResponseBody.err=error.err;
        return res.status(error.code).json(errorResponseBody);
      }
      errorResponseBody.err=error.err;
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody)
    }
}


//Controller function to delete movie
const deleteMovie=async(req,res)=>{
  // try{
  //   const response=await Movie.deleteOne({
  //     _id:req.params.movieId
  //   });
  //   return res.status(201).json({
  //       success:true,
  //       error:{},
  //       message:"Successfully deleted the movie ",
  //       data:response
  //   });
  // }catch(err){
  //     console.log(err);
  //     return res.status(500).json({
  //       success:false,
  //       error:err,
  //       data:{},
  //       message:"Something went wrong"
  //     })
  //   }
   try{
    // const response=await Movie.deleteOne({
    //   _id:req.params.movieId
    // });
    const response=await movieService.deleteMovie(req.params.movieId);
    successResponseBody.data=response;
    successResponseBody.message="Successfully deleted the movie";
    return res.status(STATUS.OK).json(successResponseBody);
  }catch(error){
      if(error.err){
        errorResponseBody.err=error.err;
        return res.status(error.code).json(errorResponseBody)
      }
      errorResponseBody.err=error.err;
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody)
    }
}


const getMovie=async(req,res)=>{
  // try{
  //   const movie=await Movie.findById(req.params.movieId);
  //   return res.status(201).json({
  //       success:true,
  //       error:{},
  //       message:"Successfully fetched the movie details",
  //       data:movie
  //   });
  // }
  // catch(err){
  //   console.log(err);
  //     return res.status(500).json({
  //       success:false,
  //       error:err,
  //       data:{},
  //       message:"Something went wrong,cannot process the request"
  //     })
  // }


  try{
    const response=await movieService.getMovieById(req.params.movieId);
    successResponseBody.data=response;
    successResponseBody.message="Successfully fetched the movie";
    return res.status(STATUS.OK).json(successResponseBody);
  }
  catch(error){
    if(error.err){
      errorResponseBody.err=error.err;
      return res.status(error.code).json(errorResponseBody)
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
}



const updateMovie=async(req,res)=>{
  try{
    const response=await movieService.updateMovie(req.params.movieId,req.body);
    successResponseBody.data=response;
    successResponseBody.message="Successfully updated the movie";
    return res.status(STATUS.OK).json(successResponseBody);
  }
  catch(error){
    if(error.err){
        errorResponseBody.err=error.err;
        return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
}



const getMovies= async(req,res)=>{
  try{
    const response=await movieService.fetchMovies(req.query);
    successResponseBody.data=response;
    successResponseBody.message="Successfully fetched the movie";
    return res.status(STATUS.OK).json(successResponseBody);
  } catch(error){
    if(error.err){
      errorResponseBody.err=error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
}



module.exports={createMovie,deleteMovie,getMovie,updateMovie,getMovies}