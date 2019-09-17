const router = require('express').Router()
    , controller = require('../controllers/homeController')
const isAuth = require('../middleware/isAuth');

router.get('/',isAuth, controller.getHome)
router.get('/profile/:id',controller.getProfile)
router.get('/totalusers',controller.getUsersCount)
router.post('/profile/:id/changeAvatar', controller.postChangeAvatar)
module.exports = router