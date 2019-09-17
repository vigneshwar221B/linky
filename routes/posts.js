const router = require('express').Router()
    , controller = require('../controllers/postsController')
    , isAuth = require('../middleware/isAuth')


router.post('/profile/:id/add-link', isAuth, controller.postAddLinks)

module.exports = router