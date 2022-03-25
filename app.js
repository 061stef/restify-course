const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');

let server = restify.createServer();

// Middleware
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
});

server.get('/parolaccia', (req, res, next) => {
    res.send({message: 'Afammok'})
});
server.get('/hello/:name', (req, res, next) => {

    let name = req.params.name;
    let age = req.query.age;
    if (age < 18) {
        res.send(401, { message: 'Unauthorized' }, { 'X-TOKEN': 'MY-TOKEN-HERE' })
    }
    res.send(200, { name: name, age: parseInt(age) });
})



server.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    console.log('server listen on port ' + config.PORT);
    require('./routes/customers')(server);
    require('./routes/users')(server);
    console.log('Service Started on port ' + config.PORT);
})

const db = mongoose.connection;

db.on('error', (err) => { console.log(err); });

db.once('open', () => {
   
    
})