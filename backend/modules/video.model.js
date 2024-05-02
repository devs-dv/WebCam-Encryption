const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    video: {
        type: String,
    },
    picture: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
