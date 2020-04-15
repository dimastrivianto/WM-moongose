const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


//bikin object baru dengan menggunakan keyword new
const userSchema = new mongoose.Schema({
    username : {
        type: String,// Mengatur tipe data yang disimpan
        unique: true,// Tidak boleh duplicate
        required: true,//Wajib di isi
        set : (val) => {return val.replace(/ /g, "")},// merubah semua space diantara karakter dengan string kosong
        validate(value){//Handle jika yang di input user bukan sebuah string, gunanya juga untuk membolehkan atau tidak
            let result = isNaN(parseInt(value))
            if(!result){
                throw new Error("Username tidak boleh angka")
            }
        }
    },
    name : {
        type: String,
        //harus di isi
        required: true,
        trim : true,//menghapus spasi sebelum dan sesudah data input
        //tidak boleh angka
        validate(value){
            let result = isNaN(parseInt(value))
            if(!result){
                throw new Error("Name tidak boleh angka")
            }
        }
    },
    email: {
        //type string
        type: String,
        //wajib ada
        required: true,
        //tidak boleh sama
        unique: true,
        trim : true,
        lowercase: true, // akan mengubah data menjadi huruf kecil semua
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Email tidak valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    age : {
        type: Number,
        default: 0, // default value
        set: val => parseInt(val)
    }
})


userSchema.pre('save', async function(next) {//mengganti password sebelum di save ke dalam database
    //this isinya adalah object data yang kita input {username: "dimas", password: "satutujuh", .....}
    let user = this

    try {
        user.password = await bcrypt.hash(user.password, 8)
    } catch (error) {
        throw new Error('Problem when hash password')
    }

    //karena sebelum kita save .pre() dijalankan dahulu untuk mengubah password, saat udah selesai jalankan next untuk menjalankan proses selanjutnya, yaitu menyimpan data ke dalam database
    next()
})


//berada dibawah semua proses didalam schema
//nama dari collection kita ('User')
const User = mongoose.model('User', userSchema)

//modul.exports harus berada dipaling bawah
//untuk export data
module.exports = User