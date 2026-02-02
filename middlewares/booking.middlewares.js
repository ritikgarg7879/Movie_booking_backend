const { STATUS, USER_ROLE, BOOKING_STATUS } = require('../utils/constants');
const ObjectId = require('mongoose').Types.ObjectId;
const theatreService = require('../services/theatre.service');
const userService = require('../services/user.service');

const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
}

const validateBookingCreateRequest = async (req, res, next) => {
    // validate the theatre id presence
    if(!req.body.theatreId) {
        badRequestResponse.err = "No theatre id provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // validate correct theatre id format
    if(!ObjectId.isValid(req.body.theatreId)) {
        badRequestResponse.err = "Invalid theatreid provided" 
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // check if theatre exists in database
    const theatre = await theatreService.getTheatre(req.body.theatreId);
    if(!theatre) {
        badRequestResponse.err = "No theatre found for the given id";
        return res.status(STATUS.NOT_FOUND).json(badRequestResponse);
    }

    // validate movie presence
    if(!req.body.movieId) {
        badRequestResponse.err = "No movie id present";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // validate correct movie id format
    if(!ObjectId.isValid(req.body.movieId)) {
        badRequestResponse.err = "Invalid movie id format";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // validate if movie is running in the theatre or not ? 
    console.log(theatre.movies.indexOf(req.body.movieId), req.body.movieId);
    if(theatre.movies.indexOf(req.body.movieId) == -1) {
        badRequestResponse.err = "Given movie is not available in the requested theatre";
        return res.status(STATUS.NOT_FOUND).json(badRequestResponse);
    }

    // validate presence of timings
    if(!req.body.timing) {
        badRequestResponse.err = "No movie timing passed";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // validate no of seats presence
    if(!req.body.noOfSeats) {
        badRequestResponse.err = "No seat provided";
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }

    // request is correct
    next();

}

const canChangeStatus = async (req, res, next) => {
    const user = await userService.getUserById(req.user);
    if(user.userRole == USER_ROLE.customer && req.body.status && req.body.status != BOOKING_STATUS.cancelled) {
        badRequestResponse.err = "You are not allowed to change the booking status";
        return res.status(STATUS.UNAUTHORISED).json(badRequestResponse);
    }
    next();
}

module.exports = {
    validateBookingCreateRequest,
    canChangeStatus
}