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

// 🔥 Indexes
showSchema.index({ movieId: 1 });
showSchema.index({ theatreId: 1 });
showSchema.index({ movieId: 1, theatreId: 1 }); // compound index

const Show = mongoose.model('Show', showSchema);

module.exports = Show;