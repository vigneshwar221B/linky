const User = require('../model/userSchema')
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
    const { id } = req.params

    User.findOne({ _id: id }).then(user => {
        console.log("started id");
        if (!user) {
            next()
        }
        else {
            res.render('main/profile', {
                title: user.username + "'s profile",
                email: user.email,
                username: user.username,
                data: user.posts,
                img: user.img,
                id,
                about: user.about
            })
        }
    }).catch(err => {
        next()
        console.log("can't find the user error");
    })
}

exports.updateProfile = (req, res, next) => {
    const image = req.file
    const { id } = req.params
    const {about} = req.body

    if (!image || !about) {
        req.flash('error', 'choose a proper file or about can\'t be empty ')
        return res.redirect(`/profile/${id}`)
    }
    else {
        const imagePath = image.path;
        var olderimagePath
        User.findOne({ _id: id })
            .then(user => {
                olderimagePath = user.img
                user.about = about
                user.img = imagePath
                return user.save()
            })
            .then(() => {
                console.log(olderimagePath)

                if(olderimagePath)
                    return unlinkAsync(olderimagePath)
                
            })
            .then(()=>{
                res.redirect(`/profile/${id}`)
            })
            .catch((err)=> console.log("img error"+err))
    }
}
