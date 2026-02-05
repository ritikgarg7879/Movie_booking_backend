const bookingController=require('../controllers/booking.controller');
const authMiddleWare=require('../middlewares/auth.middlewares');
const bookingMiddleware=require('../middlewares/booking.middlewares');


const routes=(app)=>{

  //CREATE
  app.post('/mba/api/v1/bookings',authMiddleWare.isAuthenticated,bookingMiddleware.validateBookingCreateRequest,bookingController.createBooking);

  //UPDATE
  app.patch('/mba/api/v1/bookings/:id',authMiddleWare.isAuthenticated,bookingController.updateBooking);

  //READ
  app.get('/mba/api/v1/bookings',authMiddleWare.isAuthenticated,bookingController.getBookings);
  
  //READ
  app.get('/mba/api/v1/bookings/all',authMiddleWare.isAuthenticated,authMiddleWare.isAdmin,bookingController.getAllBookings);

  //READ
  app.get('/mba/api/v1/bookings/:id',authMiddleWare.isAuthenticated,bookingController.getBookingById);

}

module.exports=routes;