const router = require('express').Router()
    , controller = require('../controllers/homeController')
const isAuth = require('../middleware/isAuth');


router.get('/',isAuth, controller.getHome)
router.get('/s', isAuth, (req,res) => {
    res.send('hi')
})
module.exports = router