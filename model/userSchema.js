const mongoose = require('mongoose')
const linkSchema = require('./linkSchema')

const user = new mongoose.Schema({
    username: String,
    email: String,
    password: String,

    posts: [linkSchema],
    favorites: [String],

    requested: [{
        body: String,
        user: String
    }]
    
})

module.exports = mongoose.model('User', user)