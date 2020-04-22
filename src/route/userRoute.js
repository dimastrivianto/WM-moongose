const express = require('express')
const router = new express.Router()
const sharp = require('sharp')

//IMPORT MODELS
//pengganti db.collection
const User= require('../models/userModel')

//UPLOAD MULTER
const multer = require('multer')
const upload = multer({
    limits : {
        fileSize : 10000000//byte
    },
    fileFilter(req, file, cb) {
        //file = {fieldname: avatar, originalname: 'maxresdefault.jpg'}
        //$ penanda bahwa kata terakhir
        // \. apapun yang ada didepannya(bebas)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File harus berupa jpg, jpeg, png'))
        }
        cb(null, true)
    }
})

//UPLOAD AVATAR
//upload.single('avatar') harus sama dengan d body form data, kemungkinan juga sama dengan react 
router.post('/users/avatar/:userid', upload.single('avatar'), async (req, res) => {
    try {

        //Edit avatar : resize, convert ke png
        let avatar = await sharp(req.file.buffer).resize({width: 250}).png().toBuffer()

        //req.file = {fieldname, originalname, buffer}
        let user = await User.findById(req.params.userid)
        //menyimpan gambar dalam bentuk buffer
        user.avatar = avatar
        // res.send(req.file.originalname)
        //menyimpan user setelah ada perubahan (menyimpan gambar)
        await user.save()
        //mengirim respon ke client
        res.send(...req.body)
    } catch (err) {
        //mengirim error
        res.send(err)
    }
}, (err, req, res, next) => {
    res.send(err.message)
})

//Read avatar
router.get('/user/avatar/:userid', async (req, res) => {
    try {
        let user = await User.findById(req.params.userid)
        //jika user belum memiliki avatar
        if(!user.avatar) return res.send('No image')
        //config untuk mengirim avatar
        res.set('content-type', 'image/png')
        //kirim avatar
        res.send(user.avatar)
    } catch (error) {
        res.send(error)
    }
})

//es7
//Async await
//try catch
//Read all user
router.get('/users', async (req, res)=>{
    
    try {
        let users = await User.find({})
        res.send(users)
    } catch (err) {
        res.send(err)
    }
    
    //es6
    // User.find({})
    // .then(resp => res.send(resp))
    // .catch(err => res.send(err))
})

//Read One User By Id
//{error : "User dengan id 989999 tidak ditemukan"}
router.get('/findbyid/:id', async (req, res)=>{
    let id = req.params.id
    try {
        //let id bisa diletakkan diluar try agar bisa diakses di catch juga
        //bisa juga pakai params
        //pembeda antara query dan params hanya dibanyaknya data, kalau mau mengirim banyak data sebaiknya pakai query saja , karena kalau params urlnya kebanyakan /:.../:../:..,  akan tetapi keduanya akan tetap bekerja
        let user = await User.findById(id)
        //jika user tidak ada
        if(!user){
            return res.send({error: `User dengan id: ${id} tidak ditemukan`})
        }
        //tambahkan new Date() agar pada saat gambar di update dia akan langsung ganti tanpa harus di refresh dahulu(karena ngambil dengan menggunakan path yang sama maka waktu disini akan menjadi pembeda)
        res.send({user, photo : `http://localhost:2020/user/avatar/${id}?time=` +new Date()})
    } catch (err) {
        res.send(err)
    }
})

// LOGIN USER
//menggunakan post walaupun sedang meng'GET' data agar data yang diambil tidak muncul di link (karena data pada saat login sensitif)
//kalau ditembak langsung data bisa muncul
router.post('/user/login', async (req, res) => {
    // req.body = {email : ... , password: ...}
    let {email, password} = req.body

    try {
        let user = await User.login(email, password)
        //jika berhasil maka akan berisi data user
        res.send(user)
    } catch (err) {
        // jika gagal akan berisi pesan err
        res.send({err_message : err.message})
    }

})

//Update User By Id
//karena mengirim melalui form data maka munculkan multer upload.single('avatar')
router.patch('/user/:_id', upload.single('avatar'), async (req, res)=>{
    let _id = req.params._id
    let body = req.body

    //isi ada di req.body
    //Name : (ada isinya)
    //Email : (ada isinya)
    //Age : (ada isinya)
    //Password : akan dicek apakah ada isinya
    //isi dari req.file
    //Select image : akan dicek apakah ada isinya

    let keys = Object.keys(body)
    //dengan menggunakan callback yang merupakan es5
    try {
        let user =await User.findById(_id)
        // {'name', 'email', 'age', 'password'}
        keys = keys.filter(key => {
            return body[key]
        })

        //update Name, Email, Age, Password
        keys.forEach(key => user[key] = req.body[key])

        //Update avatar
        //jika client mengirim gambar
        if(req.file){
            let avatar = await sharp(req.file.buffer).resize(200).png().toBuffer()
            user.avatar = avatar
        }

        await user.save()
        res.send('Update Berhasil')
    } catch (error) {
        res.send(error)
    }
})


//Delete User By Id
router.delete('/user/:_id', async (req,res)=>{
    let _id = req.params._id
    try {
        let user = await User.findByIdAndDelete({_id})
        if(!user){
            return res.send({error: `User dengan id: ${_id} tidak ditemukan di database`})
        }
        res.send({
            message: `User berhasil dihapus`,
            user
        })
    } catch (error) {
        res.send(error)
    }
})

//Create new user, REGISTER
router.post('/users', async (req,res)=>{
    //req.body ={username: 'dimas', name: 'Dimas', age: 29}

    //CREATE NEW USER
    const user = new User(req.body)

    try {
        let resp = await user.save()
        res.send(resp)
    } catch (error) {
        res.send(error)
    }

    //ES6
    //SAVE ke database
    // user.save().then(resp => res.send(resp)).catch(err => res.send(err))
})

module.exports = router
