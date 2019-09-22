const User = require('../model/userSchema')
, bcrypt = require('bcryptjs')
, sendMail = require('../helpers/sendMail')

exports.getHome = (req, res, next) => {
    res.render('welcome/index', {
        title: 'linky'
    })
}

exports.getlogin = (req, res, next) => {
    let errors = req.flash('error')
    res.render('welcome/login', {
        title: 'login',
        errors
    })
}

exports.getSignup = (req, res, next) => {
    let errors = req.flash('error')
    console.log(errors);
    res.render('welcome/signup', {
        title: 'signup',
        errors
    })
}

exports.postlogin = (req, res, next) => {
    const { email, password } = req.body
    if(!email || !password){
        req.flash('error', 'enter something')
        res.redirect('/login')
    }
    
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error','no user found')
                console.log('no user found');
                return res.redirect('/signup')
            }
           
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //setting up sessions

                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/')
                        });
                        
                    }
                    else {
                        console.log('no match');
                        req.flash('error', 'password does not match')
                        res.redirect('/login')
                    }
                })
        })
        .catch(err => console.log(err))

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.postSignup = (req, res, next) => {
    const { email, username, password, confirmpassword,firstname, lastname } = req.body
    //console.log(req.body)

    //validation
    if (!email || !username || !password || !confirmpassword || !firstname || !lastname){
        req.flash('error', 'make sure you filled everything')
        return res.redirect('/signup')
    }
    if (!validateEmail(email)){
        req.flash('error', 'check your email address')
        return res.redirect('/signup')
    }

    if (password != confirmpassword) {
        console.log("password should be same");
        req.flash('error', 'password should be the same')
        return res.redirect('/signup')
    }

    if(password.length < 8){
        req.flash('error', 'password length should be atleast 8 characters long')
        return res.redirect('/signup')
    }

    // CHECKING USER WHETHER ALREADY EXISTS
    User.findOne({email})
    .then(user => {
        if(user){
            req.flash('error','user already exists')
            console.log('user already exists');
            return res.redirect('/signup')
        }
        else{

            //hashing the password
            bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    console.log('hashing the pswd started');
                    const user = new User({
                        firstname,
                        lastname,
                        username,
                        email,
                        password: hashedPassword,
                        about: "I'm new here! But I will add something about me in the future. Stay tuned",
                        dimg: "https://svgshare.com/i/jJ.svg"
                    })

                    return user.save()
                })
                .then(() => {
                    //sending the email

                    sendMail(email, 'Your account is created!', 'Thanks for the signup')
                    return res.redirect('/login')
                })
                .catch((err) => {
                    console.log("some error" + err);
                    res.redirect('/signup')
                })
        }
    })
}

exports.postlogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
       // res.locals.isAuthenticated = !req.session.isLoggedIn
        res.redirect('/welcome')
    });
}

//TODO: RESET THE PASSWORD