const User = require('../model/userSchema')

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
                id
            })
        }
    }).catch(err => {
        next()
        console.log("can't find the user error");
    })
}

exports.postChangeAvatar = (req, res, next) => {
    const image = req.file
    const { id } = req.params

    if (!image) {
        req.flash('error', 'choose a proper file')
        return es.redirect(`/profile/${id}`)
    }
    else {
        const imagePath = image.path;

        User.findOne({ _id: id })
            .then(user => {
                user.img = imagePath
                return user.save()
            })
            .then(() => {
                res.redirect(`/profile/${id}`)
            })
    }
}


exports.getLinks = (req, res, next) => {

}
