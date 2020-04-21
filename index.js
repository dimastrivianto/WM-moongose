//CONFIG EXPRESS
const express = require('express')
const cors = require('cors')
const app= express()
const port = 2020

//IMPORT ROUTER
const userRouter = require('./src/route/userRoute')
const taskRouter = require('./src/route/taskRoute')

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
//CONFIG MONGOOSE
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mongoose-test', {//mongoose-test nama database
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
}, () => {console.log('connected to db')}) 


//IMPORT HOME
app.get('/', (req, res) =>{
    res.send(
        '<h1>API is running </h1>'
    )
})

app.listen(port, ()=>{console.log('Success Running')})