const router = require('express').Router()
    , controller = require('../controllers/postsController')
    , isAuth = require('../middleware/isAuth')

router.get('/', controller.getSearch)
router.post('/profile/:id/add-link', isAuth, controller.postAddLinks)
router.get('/searchRes', controller.getSearchRes)

router.get('/post/:id', controller.getPost)
router.post('/post/change-link', controller.changePostLinks)

module.exports = router