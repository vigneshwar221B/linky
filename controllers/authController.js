const User = require('../model/userSchema')
const bcrypt = require('bcryptjs');

exports.getHome = (req, res, next) => {
    res.render('welcome/index', {
        title: 'link'
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
    const { email, username, password, confirmpassword } = req.body

    //FIXME: VALIDATE THE USER DETAILS, CHECK USER WHETHER ALREADY EXISTS
    if (password !== confirmpassword) {
        req.flash('error', 'password should be same')
        res.redirect('/signup')
    }
   //TODO: SEND A EMAIL
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            const user = new User({
                username,
                email,
                password: hashedPassword,
            })
            
            return user.save()
        })
        .then(() => {
            return res.redirect('/login')
        })
        .catch((err) => {
            res.redirect('/signup')
        })
}

exports.postlogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/welcome');
    });
}

//TODO: RESET THE PASSWORD
