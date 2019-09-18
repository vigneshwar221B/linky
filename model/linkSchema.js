const mongoose = require('mongoose')
, Schema = mongoose.Schema 

const link = new Schema({
    name: String,
    body: String,
    user: String,

    groupLink:String,
    img: String,
    additionalLinks: [String],
    // time: Date.now(),

    likes: [Object],

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
    type: String
})

module.exports = mongoose.model('Link', link)