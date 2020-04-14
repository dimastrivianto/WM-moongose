const mongoose = require('mongoose')


//bikin object baru dengan menggunakan keyword new
const userSchema = new mongoose.Schema({
    username : {
        type: String
    },
    name : {
        type: String
    },
    age : {
        type: Number
    }
})

//nama dari collection kita ('User')
const User = mongoose.model('User', userSchema)

//untuk export data
module.exports = User