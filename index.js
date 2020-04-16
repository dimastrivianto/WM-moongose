//CONFIG EXPRESS
const express = require('express')
const cors = require('cors')
const app= express()
const port = 2020

app.use(cors())
app.use(express.json())
//CONFIG MONGOOSE
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mongoose-test', {//mongoose-test nama database
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
})

//IMPORT MODELS
//pengganti db.collection
const User= require('./src/models/userModel')
const Task= require('./src/models/taskModel')




//IMPORT HOME
app.get('/', (req, res) =>{
    res.send(
        '<h1>API is running </h1>'
    )
})

//es7
//Async await
//try catch
//Read all user
app.get('/users', async (req, res)=>{
    
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
app.get('/findbyid', async (req, res)=>{
    try {
        //let id bisa diletakkan diluar try agar bisa diakses di catch juga
        //bisa juga pakai params
        //pembeda antara query dan params hanya dibanyaknya data, kalau mau mengirim banyak data sebaiknya pakai query saja , karena kalau params urlnya kebanyakan /:.../:../:..,  akan tetapi keduanya akan tetap bekerja
        let id = req.query.id
        let user = await User.findById(id)
        //jika user tidak
        if(!user){
            return res.send({error: `User dengan id: ${id} tidak ditemukan`})
        }
        res.send(user)
    } catch (err) {
        res.send(err)
    }
})

// LOGIN USER
//menggunakan post walaupun sedang meng'GET' data agar data yang diambil tidak muncul di link (karena data pada saat login sensitif)
//kalau ditembak langsung data bisa muncul
app.post('/user/login', async (req, res) => {
    // req.body = {email : ... , password: ...}
    let {email, password} = req.body

    try {
        let user = await User.loginByEmailPassword(email, password)
        //jika berhasil maka akan berisi data user
        res.send(user)
    } catch (err) {
        // jika gagal akan berisi pesan err
        res.send({err_message : err.message})
    }

})

//Update User By Id
app.patch('/user/:_id', (req, res)=>{
    let _id = req.params._id
    let body = req.body

    //dengan menggunakan callback yang merupakan es5
    User.findByIdAndUpdate(_id, body, function(err, resp){
        if(err){
            return res.send(err)
        }
        res.send(resp)
    })
        
})


//Delete User By Id
app.delete('/user/:_id', async (req,res)=>{
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
app.post('/users', async (req,res)=>{
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


// TASK
app.post('/tasks/:userid', async (req, res) => {
    let owner= req.params.userid
    let description = req.body.description

    //task = {_id : 14 , description : memancing, completed : false, owner : 333}
    let task =new Task({description, owner})
    //user = {_id: 333, username : dimas, tasks: []}
    let user = await User.findById(owner)
    user.tasks.push(task._id)

    await task.save()
    await user.save()

    res.send({task})
    // res.send({user, task})
})


app.listen(port, ()=>{console.log('Success Running')})