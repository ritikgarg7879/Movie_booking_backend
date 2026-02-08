const mongoose = require('mongoose');

const { PAYMENT_STATUS } = require('../utils/constants');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Booking'
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [PAYMENT_STATUS.pending, PAYMENT_STATUS.failed, PAYMENT_STATUS.success],
            message: "Invalid payment status"
        },
        default: PAYMENT_STATUS.pending
    }
}, {timestamps: true});

paymentSchema.index({ booking: 1 });

const payment = mongoose.model('Payment', paymentSchema);

module.exports = payment;