const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    itemPurchased: {
        type: String,
        required: true
    },
    supplyDate: {
        type: Date,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    debtAmount: {
        type: Number,
        required: true
    },
    advanceAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },
    transaction: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            description: {
                type: String,
                required: true
            },
            debtAmount: {
                type: Number,
                required: true
            },
            paidAmount: {
                type: Number,
                required: true
            },
            balanceToPay: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);