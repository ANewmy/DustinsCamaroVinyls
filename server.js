var express = require('express');
var app = express();
var path = require('path');
var router = express.Router(); //so we can use the second file
const { ObjectId } = require('mongodb');

//router-> step1: require userVerify.js
//create later for verifying users
var userAuth = require('./user_controller/userVerify.js');
var adminAuth = require('./user_controller/adminVerify.js');
var registerAuth = require('./user_controller/registerVerify.js');
var addStoreAuth = require('./user_controller/addStoreVerify.js');
var ordersFs = require('./db_controller/dbOrders.js');
var menuFs = require('./db_controller/dbMenu.js');
var customersFs = require('./db_controller/dbCustomers.js');
var globalEmail = '';

var publicPath = path.resolve(__dirname, 'static');
app.use(express.static(publicPath));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var session = require('express-session');
var sess = {
    secret: 'keyboard cat',
    cookie: {},
};

app.use(session(sess));

var MongoClient = require('mongodb').MongoClient;
var db, menu;
var dbURL = 'mongodb://admin:password123@localhost:27017/vinyldb';

MongoClient.connect(dbURL, function(err, database) {
    if (err) throw err;

    db = database.db('vinyldb');

    // Start the application after the database connection is ready
    app.listen(8000);
    console.log('Listening on port 8000');
});

app.get('/register', function(req, res) {
    res.sendFile(`${publicPath}/register.html`);
});

app.get('/index', function(req, res) {
    res.sendFile(`${publicPath}/index.html`);
});

app.get('/home', function(req, res) {
    if (req.session.user || req.session.email) {
        globalEmail = req.session.email;
        console.log('global email: ' + globalEmail);
        res.sendFile(`${publicPath}/home.html`);
    } else res.sendFile(`${publicPath}/index.html`);
});

app.get('/store', function(req, res) {
    var query = {};
    findMenuItems(res, query);
});

app.get('/cart', function(req, res) {
    if (req.session.user || req.session.email) res.sendFile(`${publicPath}/cart.html`);
    else res.sendFile(`${publicPath}/index.html`);
});

app.get('/adminLogin', function(req, res) {
    res.sendFile(`${publicPath}/adminLogin.html`);
});

app.get('/adminIndex', function(req, res) {
    if (req.session.user) res.sendFile(`${publicPath}/adminIndex.html`);
    else res.sendFile(`${publicPath}/index.html`);
});

app.get('/stores', function(req, res) {
    if (req.session.user) res.sendFile(`${publicPath}/adminStore.html`);
    else res.sendFile(`${publicPath}/adminLogin.html`);
});

//demo orders.html, only valid user can access orders.html
app.get('/orders', function(req, res) {
    if (req.session.user) res.sendFile(`${publicPath}/orders.html`);
    else res.sendFile(`${publicPath}/adminLogin.html`);
});

app.get('/customers', function(req, res) {
    if (req.session.user) res.sendFile(`${publicPath}/customers.html`);
    else res.sendFile(`${publicPath}/adminLogin.html`);
});

app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log('destroy the session');
        res.sendFile(`${publicPath}/index.html`);
    });
});
//demo destroy session when get /logout

app.get('/showOrders', function(req, res) {
    var query = {};
    findOrderItems(res, query);
});

app.get('/showCustomers', function(req, res) {
    var query = {};
    findCustomers(res, query);
});

app.get('/getEmail', function(req, res) {
    req.session.destroy(function() {
        console.log('getting email');
        res.end(JSON.stringify({ email: globalEmail }));
        //res.sendFile(`${publicPath}/index.html`);
    });
});

app.use('/adminLogin', adminAuth);
app.use('/index', userAuth);
app.use('/register', registerAuth);
app.use('/addStore', addStoreAuth);

//router step2: use the router, userAuth
app.post('/adminLogin', adminAuth);
app.post('/index', userAuth);
app.post('/register', registerAuth);
app.post('/addStore', addStoreAuth);

app.post('/placeOrder', function(req, res) {
    if (req.session.email) {
        console.log(req.body);
        var data = req.body;
        ordersFs.insertOrders(res, data);
    } else res.sendFile(`${publicPath}/index.html`);
});
app.post('/deleteOrder', function(req, res) {
    if (req.session.user) {
        console.log(req.body);
        var data = req.body;
        var query = { _id: ObjectId(data._id) };
        ordersFs.deleteOrder(res, query);
        findOrderItems(res, data);
    } else res.sendFile(`${publicPath}/index.html`);
});
app.post('/registerCustomer', function(req, res) {
    console.log(req.body);
    var data = req.body;
    customersFs.insertCustomer(res, data);
    if (customersFs.test(res, data)) res.sendFile(`${publicPath}/home.html`);
});

app.post('/updateStore', function(req, res) {
    console.log(req.body);
    var data = req.body;
    var query = { _id: ObjectId(data._id) };
    var update = {
        $set: {
            vinylName: data.vinylName,
            price: data.price,
            imgName: data.imgName,
        },
    };
    menuFs.updateStore(res, query, update);
});
app.post('/removeItem', function(req, res) {
    if (req.session.user) {
        console.log(req.body);
        var data = req.body;
        var query = { _id: ObjectId(data._id) };
        menuFs.removeItem(res, query);
        findMenuItems(res, data);
    } else res.sendFile(`${publicPath}/index.html`);
});

function findMenuItems(res, query) {
    console.log(query);
    db
        .collection('vinylStore')
        .find(query)
        .toArray(function(err, results) {
            console.log(results);

            res.end(JSON.stringify(results));
        });
}

function findOrderItems(res, query) {
    db
        .collection('orders')
        .find(query)
        .toArray(function(err, results) {
            console.log(results);

            res.end(JSON.stringify(results));
        });
}

function findCustomers(res, query) {
    db
        .collection('customers')
        .find(query)
        .toArray(function(err, results) {
            console.log(results);

            res.writeHead(200);
            res.end(JSON.stringify(results));
        });
}

//two functions to export db and publicPath for userVerify.js
var getDb = function() {
    return db;
};

var getEmail = function() {
    return globalEmail;
};

var getPublicPath = function() {
    return publicPath;
};

module.exports.getEmail = getEmail;
module.exports.getDb = getDb;
module.exports.getPublicPath = getPublicPath;
