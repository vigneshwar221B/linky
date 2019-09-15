const router = require('express').Router()
    , controller = require('../controllers/authController')

router.get('/welcome', controller.getHome)
router.get('/login', controller.getlogin)
router.get('/signup', controller.getSignup)

router.post('/login', controller.postlogin)
router.post('/signup', controller.postSignup)

router.get('/logout', controller.postlogout)

module.exports = router