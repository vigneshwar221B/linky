const nodemailer = require('nodemailer')

const ntimes = 20
const imgUrl = "https://66.media.tumblr.com/9815f7df188fdde0e19933524fdaf4e1/456f1fcd862250cb-49/s640x960/ee006d960bef1e652004b3d3a5fdcd2745730200.jpg"

let mail = 'vigneshwar221b@gmail.com' //your mailId
let password = 'Alohomoraandrevelio1!' //your pasword
let sendtoEmail = '18tucs248@skct.edu.in' //your reciever email

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mail,
        pass: password
    }
});

for (var i = 1; i <= ntimes; i++) {

    var min = 4
    var max = 9000
    var randomSubject = Math.floor(Math.random() * (+max - +min)) + +min

    var emojis = ['😀', '🤣', '😇', '😍', '🤩', '🦊', '🦜']
    min = 0
    max = emojis.length - 1

    var randomEmoji1 = emojis[Math.floor(Math.random() * (+max - +min)) + +min]
    var randomEmoji2 = emojis[Math.floor(Math.random() * (+max - +min)) + +min]

    const mailOptions = {
        from: 'anonymous@gmail.com',
        to: sendtoEmail,
        subject: `Greetings!! ${randomSubject} ${emojis[2]}`,
        html: `<p>Kon'nichiwa ${randomEmoji1}</p>
                <img src="${imgUrl}">
                <i> Arigatou <i> bye bye ${randomEmoji2} ${randomEmoji1} ${randomEmoji2}`
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info)
    })
}