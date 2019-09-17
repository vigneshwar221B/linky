const mongoose = require('mongoose')

const link = new mongoose.Schema({
    name: String,
    body: String,
    user: String,

    groupLink:String,
    img: String,
    additionalLinks: [String],
    time: String,

    comments:[{
        body: String,
        user: String
    }],
    
    likes: [{
        user: String
    }],
    
    type: String
})

module.exports = link