const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

const validateUpdateUserRequest = (req, res, next) => {

    // validate presence of atleast one of the two i.e. userRole or userStatus
    if(!(req.body.userRole || req.body.userStatus)) {
        badRequestResponse.err = 'Malformed request, please send atleast one parameter';
        return res.status(400).json(badRequestResponse);
    }

    next();

}

module.exports = {validateUpdateUserRequest}