var bcryptjs = require('bcryptjs')

var password = "abc"

bcryptjs.hash(password,8)
.then((hashed)=>{
    
    console.log(hashed);
    bcryptjs.compare('abcd',hashed).then(ismatch=>console.log(ismatch))
})
