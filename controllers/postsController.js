const User = require('../model/userSchema')

exports.getAddLinks = (req,res,next) => {
    res.render('posts/addPosts')
}

exports.postAddLinks = (req, res, next) => {
    const {id} = req.params
    const {name, body} = req.body
    User.findOne({_id: id})
    .then(user => {
        var newData = {
            name,body
        }
        user.posts.push(newData)
        return user.save()
    })
    .then(() => {
        res.redirect(`/profile/${id}`)
    })

    
}