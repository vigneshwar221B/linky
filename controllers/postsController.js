const User = require('../model/userSchema')


exports.postAddLinks = (req, res, next) => {

    const imageExists = req.file
    
    console.log(req.file);
    const { id } = req.params
    const { name, body, groupLink } = req.body

    var tg = /t[.]me/g.exec(groupLink)
    var dd = /discord/g.exec(groupLink)
    var wa = /chat[.]whatsapp/.exec(groupLink)


    var type = tg? "telegram": (dd? "discord" : "whatsapp")

    User.findOne({ _id: id })
        .then(user => {

            user.posts.push({
                name, body, groupLink,type
            })
            console.log('------------------------');
            console.log(imageExists);
            console.log('-------------------------');
           
            if (imageExists) {
                user.posts.reverse()[0].img = imageExists.path
            }
            return user.save()
        })
        
        .then(() => {
            res.redirect(`/profile/${id}`)
        })
        .catch((err) => console.log("img error" + err))

}