const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(Date.now()),
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    image: {
        type: Buffer,
    },
});

const News = mongoose.model('News', schema);
module.exports = News;