const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

const {STATUS}=require('../utils/constants');

/**
 * 
 * @param  req -> HTTP request object 
 * @param  res  -> HTTP response object
 * @param  next -> next middleware function
 * @returns -> whether the request is valid or not
 */


const validateTheatreCreateRequest= async(req,res,next)=>{
  
  //validate the theatre name
  if(!req.body.name){
    badRequestResponse.err="The name of the theatre is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the theatre description
  if(!req.body.description){
    badRequestResponse.err="The description of the theatre is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the theatre city
  if(!req.body.city){
    badRequestResponse.err="The city of the theatre is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the theatre pincode
  if(!req.body.pincode){
    badRequestResponse.err="The pincode of the movie is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the address of the theatre
  if(!req.body.address){
    badRequestResponse.err="The address of the movie is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  next();
  
}

const validateUpdateMoviesRequest = async(req,res,next)=>{
  
  //validation of insert parameter
  if(req.body.insert == undefined){
    badRequestResponse.err="The insert parameter is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate movieIds presence
  if(!req.body.movieIds){
    badRequestResponse.err="No movie present in the request to be updated the theatre"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate if movieIds is array or not
  if(!(req.body.movieIds instanceof Array)){
    badRequestResponse.err="Expected array of movie but found something else"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate if movieIds is empty or not
  if(req.body.movieIds.length <= 0){
    badRequestResponse.err="No movie present in the array provided"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  next();
}


module.exports={
  validateTheatreCreateRequest,
  validateUpdateMoviesRequest
}