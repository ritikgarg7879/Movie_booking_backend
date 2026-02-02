const { STATUS } = require('../utils/constants');
const ObjectId = require('mongoose').Types.ObjectId;


const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
};

const validateCreateShowRequest = async (req, res, next) => {
    // validate theatre id
    if(!req.body.theatreId) {
        badRequestResponse.err = "No theatre provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    if(!ObjectId.isValid(req.body.theatreId)) {
        badRequestResponse.err = "Invalid theatre id";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // validate movie presence
    if(!req.body.movieId) {
        badRequestResponse.err = "No movie provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    if(!ObjectId.isValid(req.body.movieId)) {
        badRequestResponse.err = "Invalid movie id";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // validate timing presence
    if(!req.body.timing) {
        badRequestResponse.err = "No timing provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // validate noofseats presence
    if(!req.body.noOfSeats) {
        badRequestResponse.err = "No seat info provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // validate price presence
    if(!req.body.price) {
        badRequestResponse.err = "No price information provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    next();
}

const validateShowUpdateRequest = async (req, res, next) => {
    if(req.body.theatreId || req.body.movieId) {
        badRequestResponse.err = "We cannot update theatre or movie for an already added show";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    next();
}

module.exports = {
    validateCreateShowRequest,
    validateShowUpdateRequest
}