const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

const validateTheatreCreateRequest= async(req,res,next)=>{
  
  //validate the theatre name
  if(!req.body.name){
    badRequestResponse.err="The name of the theatre is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  //validate the theatre description
  if(!req.body.description){
    badRequestResponse.err="The description of the theatre is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  //validate the theatre city
  if(!req.body.city){
    badRequestResponse.err="The city of the theatre is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  //validate the theatre pincode
  if(!req.body.pincode){
    badRequestResponse.err="The pincode of the movie is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  //validate the address of the theatre
  if(!req.body.address){
    badRequestResponse.err="The address of the movie is not present in the request"
    return res.status(400).json(badRequestResponse);
  }

  next();
  
}

module.exports={validateTheatreCreateRequest}