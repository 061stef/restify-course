const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
    },
    status:{
        type: String,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;