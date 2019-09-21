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
    var { keyString, type, qtype } = req.query
    
    //console.log("qtype ",typeof(qtype));

    var queryList = type.split(',')
    
    var ans
    //get all the links of given type
   if(qtype == 'group'){
       Link.find({ type: { $in: queryList } })
           .then(data => {
               //console.log(data);

               var list = data.map(e => e.name)

               //find the best matches
               ans = stringSimilarity.findBestMatch(keyString, list).ratings

               //get the list by ratings
               ans.sort((first, second) => first.rating < second.rating)

               //console.log(ans);

               //get all the names
               const linkNames = ans.map(e => e.target)
               //console.log(linkNames);


               //get their corresponding links object
               return Link.find({ name: { $in: linkNames } })

           })
           .then((docs) => {
               //sort the documents

               var sortedDoc = []

               ans.forEach(e1 => {
                   docs.forEach(e2 => {
                      // console.log(e1, e2.name);
                       if (e1.target == e2.name)
                           sortedDoc.push(e2)
                   })
               })

               res.send(sortedDoc)
           })
           .catch(err => console.log(err))

   }else{
       var userNameList, ans
       User.find()
           .then(data => {
                userNameList = data.map(e => e.username)
                //console.log(userNameList)

               ans = stringSimilarity.findBestMatch(keyString, userNameList).ratings

               ans.sort((first, second) => first.rating < second.rating)

               const userNames = ans.map(e => e.target)

               console.log(userNames);

               User.find({
                   username: {$in: userNames}
               })
               .then(docs => {

                   var sortedDoc = []

                   ans.forEach(e1 => {
                       docs.forEach(e2 => {
                           // console.log(e1, e2.name);
                           if (e1.target == e2.username)
                               sortedDoc.push(e2)
                       })
                   })

                   res.send(sortedDoc)

               })
            .catch(err => console.log(err))

           })
   }
    
}

exports.getPost = async (req, res, next) => {
    const {id} = req.params

    let link = await Link.find({_id: id})
    let user = await User.find({_id: link.userId})

    if(link){
        res.render('posts/post',{
            title: link.name,
            data: link,
            user: link.user
        })
    }
    else{
        res.redirect('/')
    }
   
   
}