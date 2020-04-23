//CONFIG ENV
const dotenv = require('dotenv')
dotenv.config()


//CONFIG EXPRESS
const express = require('express')
const cors = require('cors')
const app= express()
const port = process.env.PORT // akan menggunakan port yang disediakan oleh heroku

//IMPORT ROUTER
const userRouter = require('./src/route/userRoute')
const taskRouter = require('./src/route/taskRoute')

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//CONFIG MONGOOSE
// 'mongodb://127.0.0.1:27017/mongoose-test'
//mongodb+srv://dimtriv:<password>@jcwm-bks-vezow.mongodb.net/test?retryWrites=true&w=majority
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://dimtriv:${process.env.MONGO_PASSWORD}@jcwm-bks-vezow.mongodb.net/todo-api?retryWrites=true&w=majority`, {//mongoose-test nama database
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
    useFindAndModify : false
}, () => {console.log('connected to db')}) 


//IMPORT HOME
app.get('/', (req, res) =>{
    res.send(
        '<h1>API is running </h1>'
    )
})

app.listen(port, ()=>{console.log('Success Running')})