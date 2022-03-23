const errors = require('restify-errors');
const Customer = require('../models/Customers');
const rjwt = require('restify-jwt-community');
const config = require('../config');

module.exports = (server) => {
    // get Customers con middleware
    server.get('/customers',rjwt({secret: config.JWT_SECRET}), async (req, res, next) => {
        try {
            const customers = await Customer.find({})
            res.send(customers);
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err))
        }

    });

    //Get Single Customer
    server.get('/customers/:id', async (req, res, next) => {
        const id = req.params.id;
        
        if(!id){
            return next(new errors.BadRequestError('Missing ID'));
        }

        try{
            const customer = await Customer.findById(id);
            res.send(200, customer)
        }catch (err) {
            return next(new errors.InternalServerError('There is no customer with that ID: '+id));
        }
    })

    // Add Customer
    server.post('/customers', async (req, res, next) => {
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        const {name, email, balance} = req.body;
        const customer = new Customer({
            name: name,
            email: email,
            balance: balance
        });

        try{
            const newCustomer = await customer.save();
            res.send(201, {customer: newCustomer});
            next();
        }catch(err){
            return next(new errors.InternalError(err.message));
        }
        
    });

    //update customer
    server.put('/customers/:id', async (req, res, next) => {
        try{
            const id = req.params.id;
            const customer = await Customer.findOneAndUpdate({_id: id}, req.body);
            res.send(200, customer);
            next();
        }catch(err){
            return next(new errors.InternalServerError('There is no customer with that ID: '+id));
        }
    })

    //delete customer
    server.del('/customers/:id', async (req, res, next) => {
        try{
            const id = req.params.id;
            const customer = await Customer.findOneAndDelete({_id: id});
            res.send(204);

        }catch(err){
            return next(new errors.InternalServerError('There is no customer with that ID: '+id));
        }
    })
}