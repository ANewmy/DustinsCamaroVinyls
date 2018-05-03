var express = require('express');
var app = express();
var path = require('path');
var router = express.Router(); //so we can use the second file
const { ObjectId } = require('mongodb');

//router-> step1: require userVerify.js
//create later for verifying users
var userAuth = require('./user_controller/userVerify.js');
var adminAuth = require('./user_controller/adminVerify.js');
var ordersFs = require('./db_controller/dbOrders.js');
var menuFs = require('./db_controller/dbMenu.js');

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

app.get('/', function(req, res) {
    res.sendFile(`${publicPath}/index.html`);
});

app.get('/adminLogin', function(req, res) {
    res.sendFile(`${publicPath}/adminLogin.html`);
    /* body... */
});
app.post('/placeOrder', function(req, res) {
    console.log(req.body);
    var data = req.body;
    ordersFs.insertOrders(res, data);
});

app.get('/login', function(req, res) {
    res.sendFile(`${publicPath}/login.html`);
    /* body... */
});

app.get('/store', function(req, res) {
    var query = {};
    findMenuItems(res, query);
});

app.get('/stores', function(req, res) {
    if (req.session.user) res.sendFile(`${publicPath}/adminStore.html`);
    else res.sendFile(`${publicPath}/adminLogin.html`);
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
    menuFs.updateMenu(res, query, update);
});

app.use('/adminLogin', adminAuth);
app.use('/login', userAuth);
//for any path starting with /adminLogin, use userAuth
// /adminLogin/about, /loginAdmin/Cathy

//demo orders.html, only valid user can access orders.html
app.get('/orders', function(req, res) {
    if (req.session.user) res.sendFile(`${publicPath}/orders.html`);
    else res.sendFile(`${publicPath}/adminLogin.html`);
});

app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log('destroy the session');
        res.redirect('/login.html');
    });
});
//demo destroy session when get /logout

app.get('/showOrders', function(req, res) {
    var query = {};
    findOrderItems(res, query);
});

//router step2: use the router, userAuth
app.post('/adminLogin', adminAuth);
app.post('/login', userAuth);

//app.post('/login', function(req, res) {
//    body...
//    console.log('login with post');
//});

function findMenuItems(res, query) {
    console.log(query);
    db
        .collection('vinylStore')
        .find(query)
        .toArray(function(err, results) {
            console.log(results);

            res.json(results);
        });
}

function findOrderItems(res, query) {
    db
        .collection('orders')
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

var getPublicPath = function() {
    return publicPath;
};

module.exports.getDb = getDb;
module.exports.getPublicPath = getPublicPath;
