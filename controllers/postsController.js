const User = require('../model/userSchema')
const Link = require('../model/linkSchema')

exports.postAddLinks = (req, res, next) => {

    const imageExists = req.file

    console.log(req.file)
    const { id } = req.params
    const { name, body, groupLink } = req.body

    var tg = /t[.]me/g.exec(groupLink)
    var dd = /discord/g.exec(groupLink)
    var wa = /chat[.]whatsapp/g.exec(groupLink)

    var type = tg ? "telegram" : (dd ? "discord" : "whatsapp")

    var link
    if(imageExists){
        link = new Link({
            name, body, groupLink, type,
            userId: req.user,
            img: imageExists.path
        })
    }else{
        link = new Link({
            name, body, groupLink, type,
            userId: req.user
        })
    }
    
    link.save()
    .then(() => {
        res.redirect(`/profile/${id}`)
    })
    .catch((err) => console.log("img error" + err))

}

exports.getSearch = (req, res, next) => {
    
    res.render('posts/searchPosts', {
        title: 'search'
    })
}

exports.getSearchRes = (req, res, next) => {
    res.send(req.query.keyString)
}