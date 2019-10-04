const User = require('../model/userSchema')
    , Link = require('../model/linkSchema')
    , stringSimilarity = require('string-similarity');

exports.changePostLinks = (req, res, next) => {
    const imageExists = req.file

    console.log(req.file)

    const { name, body, groupLink, postId } = req.body

    if (!name || !body || !groupLink) {
        req.flash('clinkerror', 'make sure you entered everything maybe except the photo')
        return res.redirect(`/profile/${req.user._id}`)
    }


    var tg = /https:\/\/www[.]t[.]me/g.exec(groupLink)
    var dd = /https:\/\/www[.]discord/g.exec(groupLink)
    var wa = /https:\/\/www[.]chat[.]whatsapp/g.exec(groupLink)

    var type = tg ? "telegram" : (dd ? "discord" : "whatsapp")

    Link.findOne({ _id: postId })
        .then(doc => {
            doc.name = name
            doc.body = body
            doc.groupLink = groupLink
            doc.type = type

            if (imageExists)
                doc.img = imageExists.path

            return doc.save()
        })
        .then(() => {
            res.redirect(`/profile/${req.user._id}`)
        })
        .catch(err => console.log(err))

}

exports.postAddLinks = (req, res, next) => {

    const imageExists = req.file

    console.log(req.file)
    const { id } = req.params
    const { name, body, groupLink } = req.body

    if (!name || !body || !groupLink) {
        req.flash('linkerror', 'make sure you entered everything maybe except the photo')
        return res.redirect(`/profile/${id}`)
    }

    var tg = /https:\/\/www[.]t[.]me/g.exec(groupLink)
    var dd = /https:\/\/www[.]discord/g.exec(groupLink)
    var wa = /https:\/\/www[.]chat[.]whatsapp/g.exec(groupLink)

    var type = tg ? "telegram" : (dd ? "discord" : "whatsapp")

    var link
    if (imageExists) {
        link = new Link({
            name, body, groupLink, type,
            userId: req.user,
            img: imageExists.path,
            user: req.user.username
        })
    } else {
        link = new Link({
            name, body, groupLink, type,
            user: req.user.username,
            userId: req.user,
            dimg: "http://www.pixel-creation.com/wp-content/uploads/black-red-background-sf-wallpaper-800x450.jpg"
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


const ITEMS_PER_PAGE = 3;

exports.getSearchRes = (req, res, next) => {
    var { keyString, type, qtype } = req.query
    const page = +req.query.page || 1;

    //console.log("qtype ", typeof (qtype));

    var queryList = type.split(',')
    //console.log(queryList);

    var ans
    //get all the links of given type
    if (qtype == 'group') {
        var totDoc
        Link.countDocuments({}, (err, count) => {
            Link.find({ type: { $in: queryList } })
                .then(data => {
                    //console.log(data);

                    var list = data.map(e => e.name)
                  
                    //find the best matches
                    if(list.length == 0) list = ['']
                    ans = stringSimilarity.findBestMatch(keyString, list ).ratings

                    //get the list by ratings
                    ans.sort((first, second) => first.rating < second.rating)
                    //console.log(ans);

                    //get all the names
                    const linkNames = ans.map(e => e.target)
                    //console.log(linkNames);

                    totDoc = count
                    //get their corresponding links object
                    return Link.find({ name: { $in: linkNames } })
                        .skip((page - 1) * ITEMS_PER_PAGE)
                        .limit(ITEMS_PER_PAGE);

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

                    res.send({
                        sortedDoc,
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totDoc,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totDoc / ITEMS_PER_PAGE),

                    })
                })
                .catch(err => console.log(err))
        })



    } else {
        var userNameList, ans, totUsers

        User.countDocuments({}, (err, count) => {
            totUsers = count
            User.find()
                .then(data => {
                    userNameList = data.map(e => e.username)
                    //console.log(userNameList)

                    ans = stringSimilarity.findBestMatch(keyString, userNameList).ratings

                    ans.sort((first, second) => first.rating < second.rating)

                    const userNames = ans.map(e => e.target)

                    //console.log(userNames);

                    User.find({
                        username: { $in: userNames }
                    })
                        .skip((page - 1) * ITEMS_PER_PAGE)
                        .limit(ITEMS_PER_PAGE)
                        .then(docs => {
                            var sortedDoc = []

                            ans.forEach(e1 => {
                                docs.forEach(e2 => {
                                    // console.log(e1, e2.name);
                                    if (e1.target == e2.username)
                                        sortedDoc.push(e2)
                                })
                            })
                            res.send({
                                sortedDoc,
                                currentPage: page,
                                hasNextPage: ITEMS_PER_PAGE * page < totUsers,
                                hasPreviousPage: page > 1,
                                nextPage: page + 1,
                                previousPage: page - 1,
                                lastPage: Math.ceil(totUsers / ITEMS_PER_PAGE)
                            })

                        })
                        .catch(err => console.log(err))

                })
        })

    }

}

exports.getPost = async (req, res, next) => {
    const { id } = req.params

    let link = await Link.find({ _id: id })
    let user = await User.find({ _id: link.userId })

    if (link) {
        res.render('posts/post', {
            title: link.name,
            data: link,
            user: link.user
        })
    }
    else {
        res.redirect('/')
    }
}

exports.favoriteHandler = async (req, res, next) => {

    const { id } = req.body

    let user = await User.findOne({ _id: req.user._id })
    console.log(id);
    let link = await Link.findOne({ _id: id })

    let index = user.favorites.indexOf(link._id)

    if (index == -1) {
        user.favorites.push(link)
        await user.save()
        res.send('added')
    } else {
        user.favorites.splice(index, 1)
        await user.save()
        res.send('removed')
    }

}

exports.getFavorites = (req, res, next) => {
    var list = req.user.favorites

    Link.find({
        _id: { $in: list }
    })
        .then(docs => {
            res.render('main/favorites', {
                title: 'favorites',
                data: docs
            })
        })
        .catch(err => console.log(err))

}