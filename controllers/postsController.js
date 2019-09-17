const User = require('../model/userSchema')

const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

exports.postAddLinks = (req, res, next) => {

    const imageExists = req.file
    var olderimagePath

    const { id } = req.params
    const { name, body, groupLink } = req.body

    User.findOne({ _id: id })
        .then(user => {

            user.posts.push({
                name, body, groupLink
            })
            return user.save()
        })
        .then(() => {
            if(imageExists){
                User.findOne({ _id: id })
                    .then(user => {
                        var revArray = user.posts.reverse()

                        if (revArray[0].img)
                            return unlinkAsync(olderimagePath)
                        else {
                            revArray[0].img = imageExists.path
                            user.posts = revArray.reverse()
                            return user.save()
                        }
                    })
            }
        })
        .then(() => {
            res.redirect(`/profile/${id}`)
        })
        .catch((err) => console.log("img error" + err))

}