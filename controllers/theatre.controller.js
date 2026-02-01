const theatreService=require('../services/theatre.service');
const {successResponseBody,errorResponseBody}=require('../utils/responsebody');
const {STATUS}=require('../utils/constants');


const createTheatre=async(req,res)=>{
  try{
    const response= await theatreService.createTheatre(req.body);
    successResponseBody.data=response;
    successResponseBody.message="Successfully created the theatre"
    return res.status(STATUS.CREATED).json(successResponseBody);
  }catch(error){
    if(error.err){
            errorResponseBody.err=error.err;
            return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody)
  }
}


const deleteTheatre=async(req,res)=>{
  try{
      const response=await theatreService.deleteTheatre(req.params.theatreId);
      successResponseBody.data=response;
      successResponseBody.message="Successfully deleted the given theatre";
      return res.status(STATUS.OK).json(successResponseBody);
    }catch(error){
      if(error.err){
        errorResponseBody.err=error.err;
        return res.status(err.code).json(errorResponseBody);
      }
        errorResponseBody.err=error.err;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody)
      }
}


const getTheatre=async(req,res)=>{
  try {
    const response=await theatreService.getTheatre(req.params.theatreId);
      successResponseBody.data=response;
      successResponseBody.message="Successfully fetched the data of the theatre";
      return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if(error.err){
      errorResponseBody.err=error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody)
  }
}


const getAllTheatre=async(req,res)=>{
    try {
      const response=await theatreService.getAllTheatre(req.query);
      if(response.err){
      errorResponseBody.err=response.err;
      return res.status(response.code).json(errorResponseBody);
    }
      successResponseBody.data=response;
      successResponseBody.message="Successfully fetched all the data of the theatre";
      return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
      errorResponseBody.err=error;
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody)
    }
}


const updateTheatre=async(req,res)=>{
  try{
    const response=await theatreService.updateTheatre(req.params.theatreId,req.body);
    successResponseBody.data=response;
    successResponseBody.message="Successfully updated the theatre";
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

const updateMovies=async(req,res)=>{
  try {
    const response=await theatreService.updateMoviesInTheatres(
      req.params.id,
      req.body.movieIds,
      req.body.insert
    );
      successResponseBody.data=response;
      successResponseBody.message="Successfully updated the movies in the theatre";
      return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
    if(error.err){
      errorResponseBody.err=error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
}


const getMoviesInATheatre=async(req,res)=>{
  try {
     const response=await theatreService.getMoviesInATheatre(
      req.params.id,
    );
      successResponseBody.data=response;
      successResponseBody.message="Successfully fetched the movies for the theatre";
      return res.status(STATUS.OK).json(successResponseBody);
  } catch (error) {
     if(error.err){
      errorResponseBody.err=error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
}


const checkMovieInATheatre= async(req,res)=>{
  try {
     const response=await theatreService.checkMovieInATheatre(
      req.params.theatreId,
      req.params.movieId
    );
      successResponseBody.data=response;
      successResponseBody.message="Successfully checked if movie is present in a theatre";
      return res.status(STATUS.OK).json(successResponseBody);
  }  catch (error) {
     if(error.err){
      errorResponseBody.err=error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err=error.err;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
}

module.exports={createTheatre,deleteTheatre,getTheatre,getAllTheatre,updateTheatre,updateMovies,getMoviesInATheatre,checkMovieInATheatre}