const mongoose = require('mongoose')
, Schema = mongoose.Schema

const user = new mongoose.Schema({
    
    firstname: String,
    lastname: String,
    username: String,
    email: String,

    password: String,
    img: String,
    dimg: String,
    about: String,

    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Link'
    }],

    requested: [{
        body: String,
        user: String
    }]
    
})

module.exports = mongoose.model('User', user)