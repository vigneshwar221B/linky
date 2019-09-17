const User = require('../model/userSchema')

exports.postAddLinks = (req, res, next) => {

    const {id} = req.params
    const {name, body, groupLink} = req.body
    User.findOne({_id: id})
    .then(user => {
    
            user.posts.push({
                name, body, groupLink
            })
        
        return user.save()

    })
    .then(() => {
        res.redirect(`/profile/${id}`)
    })
    .catch((err) => console.log(err))

}