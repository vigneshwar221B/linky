exports.getHome = (req, res, next) => {
    res.render('main/homepage',{
        title: 'linky',
        email: req.user.email
    })
}