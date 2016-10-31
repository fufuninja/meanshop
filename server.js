var express  = require('express');
var app      = express();
var path = require('path');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var imageUploadController = require('./public/javascripts/itemImage-control.js');
var listController = require('./public/javascripts/list-control.js');
var followController = require('./public/javascripts/follow-control.js');
var deleteController = require('./public/javascripts/delete-item.js');
var listAllController = require('./public/javascripts/listAll-control.js');
var addToCartController = require('./public/javascripts/addToCart-control.js');
var editCart = require('./public/javascripts/editCart-control.js');
var messagesController = require('./public/javascripts/messages-control.js');
var confirmController = require('./public/javascripts/confirm-control.js');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(multipartMiddleware);

//PROFILE UPDATE
app.post('/api/profile/uploadImage', multipartMiddleware, imageUploadController.uploadImage);
app.post('/api/profile/updateBio', imageUploadController.updateBio)

//USER LISTING ITEMS
app.post('/api/addItem', listController.addItem);
app.post('/api/getAllItem', listController.getAllItem);

//SHOW ALL ITEMS
app.post('/api/listAll', listAllController.listAll );

//DELETE ITEMS
app.delete('/api/item/delete/:id', deleteController.deleteItem);

//ADDING TO CART
app.post('/api/addToCart', addToCartController.addToCart);

//EDITTING THE CART
app.post('/api/viewCart', editCart.viewCart);
app.post('/api/removeFromCart', editCart.removeFromCart);

//MESSAGING SECTION
app.post('/api/messages', messagesController.sendMessages);
app.post('/api/getMessages', messagesController.getMessagesToMe);
app.post('/api/getMicroMessages', messagesController.getMicroMessages);
app.post('/api/addMicroMessages', messagesController.addMicroMessages);
app.post('/api/avoidDuplicateMessages', messagesController.avoidDuplicateMessages);

//CONFIRM BUY AND SELL
app.post('/api/confirm', confirmController.confirmSell);
app.post('/api/decline', confirmController.decline);
app.post('/api/accept', confirmController.accept);

//FOLLOW and UNFOLLOW
app.get('/api/follows', followController.getUsers);
app.post('/api/follows/get', followController.followUser);
app.post('/api/unfollows/get', followController.unfollowUser);

//EJS setup
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, 'views'));

//STATIC FILE setup
app.use(express.static(path.join(__dirname, 'public')));
app.use('/file-upload',express.static(path.join(__dirname, 'node_modules/ng-file-upload/dist/')));
app.use('/moment',express.static(path.join(__dirname, 'node_modules/moment/')));
app.use('/angular-moment',express.static(path.join(__dirname, 'node_modules/angular-moment/')));


app.use('/uploads', express.static(path.join(__dirname, 'uploads/')))
// required for passport
app.use(session({ secret: 'ilovemeanmartmeanmartmeanmart' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Say open sesame at port number: ' + port);