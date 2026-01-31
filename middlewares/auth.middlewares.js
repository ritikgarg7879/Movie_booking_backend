const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

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



module.exports={validateSignupRequest,validateSigninRequest};

