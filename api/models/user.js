const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    profileImage: String,
    userDescription: {
        type: String,
        default: null
    },
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    connectionRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    sentConnectionRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }


});

const User = mongoose.model('User', userSchema);
module.exports = User

