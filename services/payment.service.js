const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model');
const User = require('../models/user.model');

const { STATUS, BOOKING_STATUS, PAYMENT_STATUS, USER_ROLE } = require('../utils/constants');

const createPayment = async (data) => {
    try {
        // 1️⃣ Fetch booking
        const booking = await Booking.findById(data.bookingId);

        if (!booking) {
            throw {
                err: 'No booking found',
                code: STATUS.NOT_FOUND
            };
        }

        // 2️⃣ Prevent double / invalid payment
        if (booking.status === BOOKING_STATUS.successfull) {
            throw {
                err: 'Booking already completed',
                code: STATUS.FORBIDDEN
            };
        }

        if (booking.status === BOOKING_STATUS.expired) {
            throw {
                err: 'Booking already expired',
                code: STATUS.BAD_REQUEST
            };
        }

        // 3️⃣ Time validation (CORRECT WAY)
        const bookingTime = new Date(booking.createdAt).getTime();
        const currentTime = Date.now();
        const diffMinutes = (currentTime - bookingTime) / (1000 * 60);

        if (diffMinutes > 5) {
            booking.status = BOOKING_STATUS.expired;
            await booking.save();

            throw {
                err: 'Payment window expired (5 minutes)',
                code: STATUS.BAD_REQUEST
            };
        }

        // 4️⃣ Fetch show
        const show = await Show.findOne({
            movieId: booking.movieId,
            theatreId: booking.theatreId,
            showId: data.showId
        });

        if (!show) {
            throw {
                err: 'Show not found',
                code: STATUS.NOT_FOUND
            };
        }

        // 5️⃣ Create payment
        const payment = await Payment.create({
            booking: booking._id,
            amount: data.amount,
            status: PAYMENT_STATUS.pending
        });

        // 6️⃣ Validate amount
        if (payment.amount !== booking.totalCost) {
            payment.status = PAYMENT_STATUS.failed;
            booking.status = BOOKING_STATUS.cancelled;

            await payment.save();
            await booking.save();

            throw {
                err: 'Payment amount mismatch',
                code: STATUS.BAD_REQUEST
            };
        }

        // 7️⃣ Mark payment & booking success
        payment.status = PAYMENT_STATUS.success;
        booking.status = BOOKING_STATUS.successfull;

        // 8️⃣ Update show seats
        show.noOfSeats -= booking.noOfSeats;

        if (show.seatConfiguration && booking.seat) {
            const showSeatConfig = JSON.parse(show.seatConfiguration.replaceAll("'", '"'));
            const bookedSeats = JSON.parse(booking.seat.replaceAll("'", '"'));

            const bookedSeatsMap = {};

            bookedSeats.forEach(seat => {
                if (!bookedSeatsMap[seat.rowNumber]) {
                    bookedSeatsMap[seat.rowNumber] = new Set();
                }
                bookedSeatsMap[seat.rowNumber].add(seat.seatNumber);
            });

            showSeatConfig.rows.forEach(row => {
                if (bookedSeatsMap[row.number]) {
                    row.seats.forEach(seat => {
                        if (bookedSeatsMap[row.number].has(seat.number)) {
                            seat.status = 2; // booked
                        }
                    });
                }
            });

            show.seatConfiguration = JSON.stringify(showSeatConfig).replaceAll('"', "'");
        }

        // 9️⃣ Save everything
        await show.save();
        await booking.save();
        await payment.save();

        return booking;

    } catch (error) {
        console.log(error.err || error.message);
        throw error;
    }
};

const getPaymentById = async (id) => {
    try {
        const response = await Payment.findById(id).populate('booking');
        if(!response) {
            throw {
                err: 'No payment record found',
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllPayments = async (userId) => {
    try {
        const user = await User.findById(userId);
        let filter = {};
        if(user.userRole != USER_ROLE.admin) {
            filter.userId = user.id;
        }
        const bookings = await Booking.find(filter, 'id');
        const payments = await Payment.find({booking: {$in: bookings}});
        
        return payments;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createPayment,
    getPaymentById,
    getAllPayments
}