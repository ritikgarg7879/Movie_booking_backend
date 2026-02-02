const mongoose=require('mongoose')
const {Schema}=mongoose;

//We can also write new mongoose.Schema()

const showSchema = new Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Theatre'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },
    timing: {
        type: String,
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true
    },
    seatConfiguration: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    format: {
        type: String
    }
}, {timestamps: true});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;