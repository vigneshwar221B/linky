const router = require('express').Router()
    , controller = require('../controllers/postsController')
    , isAuth = require('../middleware/isAuth')


router.post('/profile/:id/add-link', isAuth, controller.postAddLinks)
router.get('/search', controller.getSearch)

module.exports = router