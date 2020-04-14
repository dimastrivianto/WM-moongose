//CONFIG EXPRESS
const express = require('express')
const app= express()
const port = 2020

//CONFIG MONGOOSE
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mongoose-test', {//mongoose-test nama database
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
})

//IMPORT MODELS
const User= require('./src/models/userModel')


app.use(express.json())

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
        let id = req.query.id
        let user = await User.findById(id)
        res.send(user)
    } catch (err) {
        res.send({error: `User dengan id: ${req.query.id} tidak ditemukan`})
    }
})

//Update User By Id
app.patch('/user/:_id', async (req, res)=>{
    try {
        let _id = req.params._id
        let newName = req.body.newname
        let user = await User.updateOne({_id}, {$set: {name: newName}})
        res.send(user)
    } catch (error) {
        res.send({error: `User dengan id: ${req.params._id} tidak ditemukan`})
    }
})

//Delete User By Id
app.delete('/user/:_id', async (req,res)=>{
    try {
        let _id = req.params._id
        let user = await User.deleteOne({_id})
        res.send(user)
    } catch (error) {
        res.send({error: `User dengan id: ${req.params._id} tidak ditemukan`})
    }
})

//Create new user
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



app.listen(port, ()=>{console.log('Success Running')})