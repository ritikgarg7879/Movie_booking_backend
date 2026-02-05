const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

const jwt = require('jsonwebtoken');
const userService=require('../services/user.service');
const { USER_ROLE,STATUS } = require('../utils/constants');

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
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the User email
  if(!req.body.email){
    badRequestResponse.err="The email of the user is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the User password 
  if(!req.body.password){
    badRequestResponse.err="The password of the user is not present in the request"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
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
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //validate the User password 
  if(!req.body.password){
    badRequestResponse.err="No password provided for sign in"
    return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
  }

  //request is valid
  next();
}


const isAuthenticated= async(req,res,next) =>{
  try {
  const token=req.headers["x-access-token"];
  if(!token){
    badRequestResponse.err="No token provided";
    return res.status(STATUS.FORBIDDEN).json(badRequestResponse);
  }

  const response=jwt.verify(token,process.env.AUTH_KEY);
  if(!response){
    badRequestResponse.err="Token not verified";
    return res.status(STATUS.UNAUTHORISED).json(badRequestResponse);
  }
  const user=await userService.getUserById(response.id);
  req.user=user.id;
  next();
  } catch (error) {
    if(error.name=="JsonWebTokenError"){
      badRequestResponse.err=error.message;
      return res.status(STATUS.UNAUTHORISED).json(badRequestResponse);
    }
    if(error.code==STATUS.NOT_FOUND){
      badRequestResponse.err="User doesn't exist ";
      return res.status(error.code).json(badRequestResponse);
    }
    badRequestResponse.err=error;
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(badRequestResponse)
  }
  
}

const validateResetPasswordRequest = (req, res, next) => {
    // validate old password presence
    if(!req.body.oldPassword) {
        badRequestResponse.err = 'Missing the old password in the request';
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // validate new password presence
    if(!req.body.newPassword) {
        badRequestResponse.err = 'Missing the new password in the request';
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // we can proceed
    next();
}


const isAdmin = async (req, res, next) => {
    // console.log(req.user);
    const user = await userService.getUserById(req.user);
    if(user.userRole != USER_ROLE.admin) {
        badRequestResponse.err = "User is not an admin, cannot proceed with the request"
        return res.status(STATUS.UNAUTHORISED).json(badRequestResponse);
    }
    next();
}

const isClient = async (req, res, next) => {
    const user = await userService.getUserById(req.user);
    if(user.userRole != USER_ROLE.client) {
        badRequestResponse.err = "User is not a client, cannot proceed with the request";
        return res.status(STATUS.UNAUTHORISED).json(badRequestResponse);
    }
    next();
}

const isAdminOrClient = async (req, res, next) => {
    const user = await userService.getUserById(req.user);
    if(user.userRole != USER_ROLE.admin && user.userRole != USER_ROLE.client) {
        badRequestResponse.err = "User is neither a client not an admin, cannot proceed with the request";
        return res.status(STATUS.UNAUTHORISED).json(badRequestResponse);
    }
    next();
}



module.exports={validateSignupRequest,validateSigninRequest,isAuthenticated,validateResetPasswordRequest,isAdmin,isClient,isAdminOrClient};

