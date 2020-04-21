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
        // Mencari user berdasarkan id kemudian mencari semua todos yang ia punya
        let user = await User.find({_id : req.params.userid}).populate({//akan mencari properti namanya tasks dan akan mencari id dari collection di database task, liat userModel, bagian property tasks ada ref ke database task, dan berisi objectId(type) dari data di database task. makanya bisa mencari data di database task berdasarkan idnya
            path: 'tasks'
        }).exec()
        // mengirim list tasknya saja
        res.send(user[0].tasks)
    } catch (error) {
        
    }
})

// UPDATE TASK
router.patch('/tasks/:taskid', async (req, res)=> {
    let _id = req.params.taskid
    let keys = Object.keys(req.body)
    let finalKeys = keys.filter(val => {//kalau pakai == (false == string kosong) akan menjadi true, nilai truthy dan falsy
        if(req.body[val] === undefined || req.body[val] === ""){
            return false
        }else {
            return true
        }
    })
    
    // let body = req.body
    try {
        // let task = await Task.findById(_id, body)
        let task = await Task.findById(_id)
        finalKeys.forEach(val => task[val] = req.body[val])
        await task.save()
        res.send('Update berhasil')
    } catch (error) {
        res.send(error)
    }
})

//DELETE TASK
router.delete('/task/:taskid', async (req, res)=> {
    
    try {
        let task = await Task.findByIdAndDelete(req.params.taskid)
        let user = await User.findById(task.owner)

        //return taskid yang tidak sam dengan task._id
        user.tasks = user.tasks.filter(taskid => {
            return task._id !== taskid
        })

        await user. save()

        res.send('Delete berhasil')
    } catch (error) {
        res.send(error)
    }
})

module.exports = router