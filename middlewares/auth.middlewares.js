const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

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

module.exports={validateSignupRequest};

