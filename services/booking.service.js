const Booking=require('../models/booking.model');
const {STATUS}=require('../utils/constants');
const Show = require('../models/show.model');
const redis = require('../config/redis');


const createBooking = async (data) => {
  try {

    // 1️⃣ Fetch show using only showId
    const show = await Show.findById(data.showId);

    if (!show) {
      throw {
        err: "Show not found",
        code: STATUS.NOT_FOUND
      };
    }

    // 2️⃣ Validate seat availability
    if (show.noOfSeats < data.noOfSeats) {
      throw {
        err: "Not enough seats available",
        code: STATUS.BAD_REQUEST
      };
    }

    // 🔒  LOCK SEATS IN REDIS

    if (!data.seat) {
      throw {
        err: "Seat information required",
        code: STATUS.BAD_REQUEST
      };
    }

    const selectedSeats = JSON.parse(data.seat.replaceAll("'", '"'));

    const lockedKeys = []; // store successfully locked seats

    for (let seat of selectedSeats) {

      const lockKey = `lock:show:${data.showId}:row:${seat.rowNumber}:seat:${seat.seatNumber}`;

      // 🔥 ATOMIC LOCK
      const lock = await redis.set(lockKey, data.userId, "NX", "EX", 300);

      if (!lock) {
        // ❌ If any seat fails, unlock already locked seats
        for (let key of lockedKeys) {
          await redis.del(key);
        }

        throw {
          err: `Seat ${seat.seatNumber} in row ${seat.rowNumber} already locked`,
          code: STATUS.BAD_REQUEST
        };
      }

      lockedKeys.push(lockKey);
    }

    
    // 3️⃣ Calculate total cost
    data.totalCost = data.noOfSeats * show.price;
    data.theatreId = show.theatreId;
    data.movieId = show.movieId;

    // 4️⃣ Create booking (data already contains showId)
    const response = await Booking.create(data);

    return response.populate('movieId theatreId showId');

  } catch (error) {

    if (error.name === 'ValidationError') {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });

      throw {
        err,
        code: STATUS.UNPROCESSABLE_ENTITY
      };
    }

    throw error;
  }
};


const updateBooking = async (data, bookingId) => {
    try {
        const response = await Booking.findByIdAndUpdate(bookingId, data, {
            new: true, runValidators: true
        });
        if(!response) {
            throw {
                err: "No booking found for the given id",
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: STATUS.UNPROCESSABLE_ENTITY};
        }
        console.log(error);
        throw error;
    }
}

const getBookings = async (data) => {
    try {
        const response = await Booking.find(data);
        return response;
    } catch (error) {
        throw error;
    }
}

const getAllBookings = async () => {
    try {
        const response = await Booking.find();
        return response;
    } catch (error) {
        throw error;
    }
}

const getBookingById = async (id, userId) => {
    try {
        const response = await Booking.findById(id);
        if(!response) {
            throw {
                err: 'No booking records found for the id',
                code: STATUS.NOT_FOUND
            }
        }
        if(response.userId != userId) {
            throw {
                err: 'Not able to access the booking',
                code: STATUS.UNAUTHORISED
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
} 


module.exports={createBooking,updateBooking,getBookingById,getBookings,getAllBookings};