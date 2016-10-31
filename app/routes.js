module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
   app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    //=====================================
    // GET USER DATA======================
    //====================================
    app.get('/api/user', function(req, res){
        res.send(req.user);
    })

    //======================================
    //POSTING  SECTION=====================
    //======================================
    app.get('/mystore', isLoggedIn, function(req, res){
        res.render('main.ejs', {
            user : req.user
        });
    })

    //======================================
    //MAIN MENU SECTION=====================
    //======================================
    app.get('/main', isLoggedIn, function(req, res){
        res.render('mainmenu.ejs', {
            user : req.user
        });
    })

    //======================================
    //CART SECTION=====================
    //======================================
    app.get('/mycart', isLoggedIn, function(req, res){
        res.render('myCart.ejs', {
            user : req.user
        });
    })

    //======================================
    //MICRO MESSAGES SECTION=====================
    //======================================
    app.get('/microMessages', isLoggedIn, function(req, res){
        res.render('microMessages.ejs');
    })


    //======================================
    //FOLLOW  SECTION=======================
    //======================================
    app.get('/follow', isLoggedIn, function(req, res){
        res.render('follow.ejs');
    })

    //======================================
    //MESSAGE  SECTION=======================
    //======================================
    app.get('/messages', isLoggedIn, function(req, res){
        res.render('messages.ejs');
    })

     // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logOut();
        res.redirect('/');
        res.redirect(req.get('referer'));
        res.redirect('back');
    });
    
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}