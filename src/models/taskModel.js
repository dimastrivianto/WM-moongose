const mongoose = require('mongoose')

const taskSchema =new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
        validate(value){//Handle jika yang di input user bukan sebuah string, gunanya juga untuk membolehkan atau tidak
            let result = isNaN(parseInt(value))
            if(!result){
                throw new Error("Username tidak boleh angka")
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }
}, {timestamps: true})

const Task = mongoose.model('Task', taskSchema)
module.exports= Task