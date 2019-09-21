const User = require('../model/userSchema')
, bcrypt = require('bcryptjs')
, sendMail = require('../helpers/sendMail')

exports.getHome = (req, res, next) => {
    res.render('welcome/index', {
        title: 'linky'
    })
}

exports.getlogin = (req, res, next) => {
    res.render('welcome/login', {
        title: 'login'
    })
}

exports.getSignup = (req, res, next) => {
    let error = req.flash('error')
    console.log(error);
    res.render('welcome/signup', {
        title: 'signup'
    })
}

exports.postlogin = (req, res, next) => {
    const { email, password } = req.body
    console.log(email, password);
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
                        res.redirect('/login')
                    }
                })
        })
        .catch(err => console.log(err))

}

exports.postSignup = (req, res, next) => {
    const { email, username, password, confirmpassword,firstname, lastname } = req.body
    console.log(req.body)

    //FIXME: VALIDATE THE USER DETAILS
    if (password != confirmpassword) {
        console.log("password should be same");
        req.flash('error', 'password should be same')
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