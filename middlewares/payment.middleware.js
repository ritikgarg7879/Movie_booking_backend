const { STATUS } = require("../utils/constants");
const ObjectId = require('mongoose').Types.ObjectId;


const badRequestResponse={
  success:false,
  err:{},
  data:{},
  message:"Malformed Request | Bad Request"
};


const verifyPaymentCreateRequest = async (req, res, next) => {
    // validate booking id presence
    if(!req.body.bookingId) {
        badRequestResponse.err = 'No booking id received';
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // validate correct bookingid
    if(!ObjectId.isValid(req.body.bookingId)) {
        badRequestResponse.err = 'Invalid booking id';
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // validate amount presence
    if(!req.body.amount) {
        badRequestResponse.err = 'No amount sent';
        return res.status(STATUS.BAD_REQUEST).json(badRequestResponse);
    }
    // everything is fine
    next();

}

module.exports = {
    verifyPaymentCreateRequest
}