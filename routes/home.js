const router = require('express').Router()
    , controller = require('../controllers/homeController')
const isAuth = require('../middleware/isAuth');

router.get('/profile/:id',controller.getProfile)
router.get('/totalusers',controller.getUsersCount)
router.post('/profile/:id/updateProfile', controller.updateProfile)

module.exports = router