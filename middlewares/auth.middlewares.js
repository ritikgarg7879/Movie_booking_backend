const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

const jwt = require('jsonwebtoken');
const userService=require('../services/user.service');

/**
 * 
 * @param  req ->http request object
 * @param  res ->http response object
 * @param  next ->next middleware 
 * @returns 
 */

const validateSignupRequest= async(req,res,next)=>{
  
  //validate the User name
  if(!req.body.name){
    badRequestResponse.err="The name of the user is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  //validate the User email
  if(!req.body.email){
    badRequestResponse.err="The email of the user is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  //validate the User password 
  if(!req.body.password){
    badRequestResponse.err="The password of the user is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  next();
  
}

/**
 * 
 * @param  req ->http request object
 * @param  res ->http response object
 * @param  next ->next middleware 
 * @returns 
 */


const validateSigninRequest= async(req,res,next)=>{
  
  //validate the User email
  if(!req.body.email){
    badRequestResponse.err="No email present for sign in"
    return res.status(400).json(badRequestResponse);
  }

  //validate the User password 
  if(!req.body.password){
    badRequestResponse.err="No password provided for sign in"
    return res.status(400).json(badRequestResponse);
  }

  //request is valid
  next();
}


const isAuthenticated= async(req,res,next) =>{
  try {
  const token=req.headers["x-access-token"];
  if(!token){
    badRequestResponse.err="No token provided";
    return res.status(403).json(badRequestResponse);
  }

  const response=jwt.verify(token,process.env.AUTH_KEY);
  if(!response){
    badRequestResponse.err="Token not verified";
    return res.status(401).json(badRequestResponse);
  }
  const user=await userService.getUserById(response.id);
  req.user=user.id;
  next();
  } catch (error) {
    if(error.name=="JsonWebTokenError"){
      badRequestResponse.err=error.message;
      return res.status(401).json(badRequestResponse);
    }
    if(error.code==404){
      badRequestResponse.err="User doesn't existI ";
      return res.status(error.code).json(badRequestResponse);
    }
    badRequestResponse.err=error;
    return res.status(500).json(badRequestResponse)
  }
  
}

module.exports={validateSignupRequest,validateSigninRequest,isAuthenticated};

