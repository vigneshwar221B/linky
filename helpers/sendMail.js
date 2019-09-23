const nodemailer = require('nodemailer')

module.exports = (to, subject, body) => {
        
    const imgUrl = "https://66.media.tumblr.com/9815f7df188fdde0e19933524fdaf4e1/456f1fcd862250cb-49/s640x960/ee006d960bef1e652004b3d3a5fdcd2745730200.jpg"

    let mail = '' //your mailId
    let password = '' //your pasword

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mail,
            pass: password
        }
    });

    var emojis = ['😀', '🤣', '😇', '😍', '🤩', '🦊', '🦜']
    min = 0
    max = emojis.length - 1

    var randomEmoji1 = emojis[Math.floor(Math.random() * (+max - +min)) + +min]

    const mailOptions = {
        from: 'anonymous@gmail.com',
        to,
        subject: `Greetings!! ${randomEmoji1}  ${subject}`,
        html: `${body}`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log(err)
        else
            console.log(info)
    })

}