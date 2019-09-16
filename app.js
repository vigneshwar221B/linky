const path = require('path')

const express = require('express')
    , app = express()
    , bp = require('body-parser')
    , mongoose = require('mongoose')
    , flash = require('connect-flash')
    , session = require('express-session')
    , MongoDBStore = require('connect-mongodb-session')(session)
    , User = require('./model/userSchema')
    , csrf = require('csurf')
    , morgan = require('morgan')

const csrfProtection = csrf();

//importing routes
var authRoute = require('./routes/auth')
    , homeRoute = require('./routes/home')
    , postsRoute = require('./routes/posts')

//setting up configs
app.set('view engine', 'ejs')
app.use(bp.urlencoded({ extended: true }))
app.use(flash())
app.use(morgan('dev'))

//setting up cookies
const store = new MongoDBStore({
    uri: 'mongodb://localhost/linksDB',
    collection: 'sessions'
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'meow',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

//adding csrf protection
app.use(csrfProtection);

//connect to mongodb
mongoose.connect('mongodb://localhost/linksDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('connected to DB')
})
.catch(err => {
    console.log('error connectying to DB')
})

//custom middlewares
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//setting up the routes
app.use(authRoute)
app.use(postsRoute)
app.use(homeRoute)

//404 page
app.use((req, res, next) => {
    res.send("404 page")
})

//starting the server
app.listen(8080, () => console.log('server started at http://localhost:8080'))