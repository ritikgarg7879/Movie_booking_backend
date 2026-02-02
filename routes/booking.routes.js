const bookingController=require('../controllers/booking.controller');
const authMiddleWare=require('../middlewares/auth.middlewares');
const bookingMiddleware=require('../middlewares/booking.middlewares');


const routes=(app)=>{

  //CREATE
  app.post('/mba/api/v1/bookings',authMiddleWare.isAuthenticated,bookingMiddleware.validateBookingCreateRequest,bookingController.createBooking)

}

module.exports=routes;