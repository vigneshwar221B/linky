const User = require('../model/userSchema')
const Link = require('../model/linkSchema')

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

exports.getUsersCount = (req, res, next) =>
    User.countDocuments({}, (err, count) => {
        res.send(`Total no. of users: ${count}`)
})

exports.getHome = (req, res, next) => {
    res.render('main/homepage', {
        title: 'linky',
        email: req.user.email,
        id: req.user._id
    })
}

exports.getProfile = (req, res, next) => {
    let errors = req.flash('error')
    let lerror = req.flash('linkerror')
    let clerror = req.flash('clinkerror')
    const { id } = req.params

    User.findOne({ _id: id }).then(user => {
        console.log("started id");
        if (!user) {
            next()
        }
        else {
            Link.find({ userId: id})
            .then((posts) => {
                res.render('main/profile',{
                    user,
                    posts,
                    activeUser: req.user,
                    title: user.username + '\'s profile',
                    id,
                    errors,
                    lerror,
                    clerror
                })
            })
        }
    })
    .catch(err => {
        next()
        console.log("can't find the user error");
    })
}

exports.updateProfile = (req, res, next) => {
    console.log('update profile started');

    const image = req.file
    const { id } = req.params
    const {about} = req.body

    if (!image && !about) {
        console.log('some errror');
        req.flash('error', 'you can\'t submit nothing')
        return res.redirect(`/profile/${id}`)
    }

    else if(image){
        const imagePath = image.path;
        var olderimagePath
        User.findOne({ _id: id })
            .then(user => {
                console.log('there is a image');
                olderimagePath = user.img

                user.img = imagePath
                return user.save()
            })
            .then(() => {
                console.log('prev path: ');
                console.log(olderimagePath)

                if (olderimagePath)
                    return unlinkAsync(olderimagePath)

            })
            .then(() => {
                res.redirect(`/profile/${id}`)
            })
            .catch((err) => console.log("img error" + err))

    }
    else {
        console.log('else part');
     
        User.findOne({ _id: id })
            .then(user => {
               
                user.about = about
                return user.save()
            })
           
            .then(()=>{
                res.redirect(`/profile/${id}`)
            })
            .catch((err)=> console.log("img error"+err))
    }
}
