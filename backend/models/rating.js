const mongoose = require('mongoose');
const RatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    video: {
        type: String,
        required: true
    },
    rating: {
        type: Boolean,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Rating', RatingSchema);