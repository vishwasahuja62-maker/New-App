const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    topic: {
        type: String
    },
    status: {
        type: String,
        default: 'resolved'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doubt', doubtSchema);
