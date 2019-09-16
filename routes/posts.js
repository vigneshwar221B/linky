const router = require('express').Router()
    , controller = require('../controllers/postsController')
    , isAuth = require('../middleware/isAuth')

router.get('/profile/:id/add-Links', isAuth, controller.getAddLinks)
router.post('/profile/:id/add-Links', isAuth, controller.postAddLinks)

module.exports = router