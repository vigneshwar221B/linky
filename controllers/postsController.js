const User = require('../model/userSchema')
    , Link = require('../model/linkSchema')
    , stringSimilarity = require('string-similarity');

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
    if (imageExists) {
        link = new Link({
            name, body, groupLink, type,
            userId: req.user,
            img: imageExists.path
        })
    } else {
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
    var { keyString, type } = req.query
    
    console.log("type "+typeof(type));

    var queryList = type.split(',')
    
    var ans
    //get all the links of given type
   
    Link.find({ type : {$in : queryList} })
        .then(data => {
            console.log(data);

            var list = data.map(e => e.name)

            //find the best matches
            ans = stringSimilarity.findBestMatch(keyString, list).ratings

            //get the list by ratings
            ans.sort((first, second) => first.rating < second.rating)
           
            console.log(ans);

            //get all the names
            const linkNames = ans.map(e => e.target)
            console.log(linkNames);

            
            //get their corresponding links object
            return Link.find({ name: { $in: linkNames } })

        })
        .then((docs) => {
            //sort the documents

            var sortedDoc = []

            ans.forEach(e1 => {
                docs.forEach(e2 => {
                    console.log(e1, e2.name);
                    if(e1.target == e2.name)
                        sortedDoc.push(e2)
                })
            })
           

            res.send(sortedDoc)
        })
        .catch(err => console.log(err))


}