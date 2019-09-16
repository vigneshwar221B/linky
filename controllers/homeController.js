const User = require('../model/userSchema')

exports.getUsersCount = (req, res, next) => 
    User.countDocuments({}, (err, count)=>{
        res.send(`Total no. of users: ${count}`)
    })


exports.getHome = (req, res, next) => {
    res.render('main/homepage',{
        title: 'linky',
        email: req.user.email,
        id: req.user._id
    })
}

exports.getProfile = (req,res, next) => {
    const { id } = req.params
    
    User.findOne({_id: id}).then(user => {
        console.log("started id");
        if(!user){
            next()
        }
        else{
        res.render('main/profile',{
            title: user.username+"'s profile",
            email: user.email,
            username: user.username,
            data: user.posts
        })
    }
    }).catch(err => {
        next()
        console.log("can't find the user error");
    })  
}

exports.getLinks = (req,res, next) => {

}
