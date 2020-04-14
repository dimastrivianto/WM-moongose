//CONFIG EXPRESS
const express = require('express')
const app= express()
const port = 2020

//CONFIG MONGOOSE
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mongoose-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
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

//Read all user
app.get('/users', (req,res)=>{
    User.find({})
    .then(resp => res.send(resp))
    .catch(err => res.send(err))
})

//Create new user
app.post('/users', (req,res)=>{
    //req.body ={username: 'dimas', name: 'Dimas', age: 29}

    //CREATE NEW USER
    const user = new User(req.body)

    //SAVE ke database
    user.save().then(resp => res.send(resp)).catch(err => res.send(err))
})

app.listen(port, ()=>{console.log('Success Running')})