const Movie=require('../models/movie.model')
const movieService=require('../services/movie.service')
const {successResponseBody,errorResponseBody}=require('../utils/responsebody');


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
      if(response.err){
        errorResponseBody.err=response.err;
        errorResponseBody.message="Validation failed on few parameters on the request body"
        return res.status(response.code).json(errorResponseBody);
      }
      successResponseBody.data=movie;
      successResponseBody.message="Successfully created the movie";

      return res.status(201).json(successResponseBody)
    }
    catch(err){
      console.log(err);
      return res.status(500).json(errorResponseBody)
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
    if(response.err){
      errorResponseBody.err=response.err;
      return res.status(response.code).json(errorResponseBody)
    }
    successResponseBody.data=response;
    successResponseBody.message="Successfully deleted the movie";
    return res.status(200).json(successResponseBody);
  }catch(err){
      console.log(err);
      return res.status(500).json(errorResponseBody)
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
    if(response.err){
      errorResponseBody.err=response.err;
      return res.status(response.code).json(errorResponseBody)
    }
    successResponseBody.data=response;
    return res.status(200).json(successResponseBody);
  }
  catch(err){
    console.log(err);
      return res.status(500).json(errorResponseBody);
  }
}



const updateMovie=async(req,res)=>{
  try{
    const response=await movieService.updateMovie(req.params.movieId,req.body);
     if(response.err){
        errorResponseBody.err=response.err;
        errorResponseBody.message="The updates that we are trying to apply doesn't validate the schema"
        return res.status(response.code).json(errorResponseBody);
      }
    successResponseBody.data=response;
    return res.status(200).json(successResponseBody);
  }
  catch(err){
    console.log(err);
    errorResponseBody.err=err;
    return res.status(500).json(errorResponseBody);
  }
}



const getMovies= async(req,res)=>{
  try{
    const response=await movieService.fetchMovies(req.query);
    if(response.err){
      errorResponseBody.err=response.err;
      return re.status(response.code).json(errorResponseBody);
    }
    successResponseBody.data=response;
    return res.status(200).json(successResponseBody);
  } catch(err){
    console.log(err);
    errorResponseBody.err=err;
    return res.status(500).json(errorResponseBody);
  }
}



module.exports={createMovie,deleteMovie,getMovie,updateMovie,getMovies}