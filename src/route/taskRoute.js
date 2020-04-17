const express = require('express')
const router = new express.Router()

//IMPORT MODELS
//pengganti db.collection
const Task= require('../models/taskModel')
const User= require('../models/userModel')


// TASK
//Create task
router.post('/tasks/:userid', async (req, res) => {
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

//READ task by id
router.get('/tasks/:userid', async (req, res)=>{

    try {
        let user = await User.find({_id : req.params.userid}).populate({//akan mencari properti namanya tasks dan akan mencari id dari collection di database task, liat userModel, bagian property tasks ada ref ke database task, dan berisi objectId(type) dari data di database task. makanya bisa mencari data di database task berdasarkan idnya
            path: 'tasks'
        }).exec()
        res.send(user[0].tasks)
    } catch (error) {
        
    }
})

module.exports = router