const bycript = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // get User by email
            const user = await User.findOne({ email: email});
            //Match password
            bycript.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    resolve(user);
                }else{
                    //Pass don't match
                    reject('Password Not Match');
                }
            });
        }catch (err) {
            // Email not found
            reject('Authentication Failed!')
        }
    })
}