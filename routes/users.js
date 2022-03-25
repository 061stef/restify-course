const errors = require('restify-errors');
const User = require('../models/User');
const bycript = require('bcryptjs');
const auth = require('../auth');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');
const rjwt = require('restify-jwt-community');

module.exports = (server) => {

    server.get('/users', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const users = await User.find().where('status').equals('active');
            res.send(200, users);
            next();

        } catch (err) {
            return next(new errors.InternalServerError('Server Error'));
        }
    });

    server.post('/register', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const userExists = await User.findOne({ email: email});
            if(userExists) {
                return res.send(409, {code: 'duplicated', message: 'User already exists'})
            }
            const user = new User({ email, password });
            bycript.genSalt(10, (err, salt) => {
                bycript.hash(user.password, salt, async (err, hash) => {
                    // Hash password is
                    user.password = hash;
                    // Save User
                    try {
                        const newUser = await user.save();
                        res.send(201);
                        next()
                    } catch (err) {
                        return next(new errors.InternalError(err.message));
                    }

                });
            })
        }catch (error) {
            return next(new errors.duplicateError(error.message));
        }
        
    })

    //auth Users
    server.post('/auth', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await auth.authenticate(email, password);

            // create JWT token
            const token = jsonwebtoken.sign(user.toJSON(), config.JWT_SECRET, { expiresIn: '30m' });

            const { iat, exp } = jsonwebtoken.decode(token);

            //Respond with token
            res.send({ iat: iat, exp: exp, token: token });
            next();

        } catch (err) {
            //user Unauthorized
            return next(new errors.UnauthorizedError(err));
        }
    });

    //me call back
    server.get('/me', async (req, res, next) => {
        const headers = req.headers;
        try {
            const token = headers['authorization'].replace('Bearer ', '');
            const user = jsonwebtoken.decode(token);
            if (user) {
                const { _id } = user;
                const findUser = await User.findById(_id);
                res.send(findUser);
            } else {
                res.send(404, 'User Not Found');
            }
            next()
        } catch (err) {
            return next(new errors.UnauthorizedError('Unauthorized'));
        }


    });

    server.del('/users/:id', async function (req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findOneAndDelete({ _id: id });
            res.send(200, 'User Deleted');
            next();
        } catch (err) {
            return next(new errors.BadRequestError('User not exist'));
        }

    })
}