const mongoose = require('mongoose');
const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model');

const { STATUS, BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');

const createPayment = async (data) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        // 1️⃣ Fetch booking inside session
        const booking = await Booking.findById(data.bookingId).session(session);

        if (!booking) {
            throw {
                err: 'No booking found',
                code: STATUS.NOT_FOUND
            };
        }

        // 2️⃣ Prevent double payment
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

        // 3️⃣ Check payment window
        const bookingTime = new Date(booking.createdAt).getTime();
        const currentTime = Date.now();
        const diffMinutes = (currentTime - bookingTime) / (1000 * 60);

        if (diffMinutes > 5) {
            booking.status = BOOKING_STATUS.expired;
            await booking.save({ session });

            throw {
                err: 'Payment window expired (5 minutes)',
                code: STATUS.BAD_REQUEST
            };
        }

        // 4️⃣ Fetch show properly (using showId from booking)
        const show = await Show.findById(booking.showId).session(session);

        if (!show) {
            throw {
                err: 'Show not found',
                code: STATUS.NOT_FOUND
            };
        }

        if (show.noOfSeats < booking.noOfSeats) {
            throw {
                err: 'Not enough seats available',
                code: STATUS.BAD_REQUEST
            };
        }

        // 5️⃣ Validate amount BEFORE creating payment
        if (data.amount !== booking.totalCost) {
            booking.status = BOOKING_STATUS.cancelled;
            await booking.save({ session });

            throw {
                err: 'Payment amount mismatch',
                code: STATUS.BAD_REQUEST
            };
        }

        // 6️⃣ Create payment (pending)
        const [payment] = await Payment.create([{
            booking: booking._id,
            amount: data.amount,
            status: PAYMENT_STATUS.success
        }], { session });

        // 7️⃣ Update show seats
        show.noOfSeats -= booking.noOfSeats;

        // Seat configuration update
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

        await show.save({ session });

        // 8️⃣ Update booking status
        booking.status = BOOKING_STATUS.successfull;
        await booking.save({ session });

        // 9️⃣ Commit
        await session.commitTransaction();
        session.endSession();

        return booking;

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

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