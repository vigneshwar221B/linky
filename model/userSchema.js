const mongoose = require('mongoose')
const linkSchema = require('./linkSchema')

const user = new mongoose.Schema({
    
    firstname: String,
    lastname: String,
    username: String,
    email: String,

    password: String,
    img: String,
    about: String,

    posts: [linkSchema],
    favorites: [String],

    requested: [{
        body: String,
        user: String
    }]
    
})

module.exports = mongoose.model('User', user)