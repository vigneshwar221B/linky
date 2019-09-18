const mongoose = require('mongoose')

const user = new mongoose.Schema({
    
    firstname: String,
    lastname: String,
    username: String,
    email: String,

    password: String,
    img: String,
    about: String,

    favorites: [Object],

    requested: [{
        body: String,
        user: String
    }]
    
})

module.exports = mongoose.model('User', user)