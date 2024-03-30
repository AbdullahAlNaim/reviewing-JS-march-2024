const express = require('express')
const app = express()
const port = 9000
const path = require('path')
const mongoose = require('mongoose')

const Task = require('./models/task')
const bodyParser = require('body-parser')

uri = 'mongodb://127.0.0.1:27017/Tasks'

app.use(express.json())
app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

async function connect() {
  try {
    await mongoose.connect(uri)
    console.log('Connected to Database! WOOO HOOO')
  } catch (err) {
    console.error(err)
  }
}

connect()

task = [
  {
    name: 'clean'
  },
  {
    name: 'exercise'
  }
]

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/home', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.render('home', { tasks })
  } catch (err) {
    console.error('Error fetching tasks:', err)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/tasks', async (req, res) => {
  console.log('Here are your tasks')
  const tasks = await Task.find()
  res.render('tasks', { tasks })
  // console.log(task)
})

// app.post('/tasks', (req, res) => {
//   console.log(req.body)
//   task.push(req.body)

//   res.redirect('/tasks')
// })

app.post('/tasks', async (req, res) => {
  try {
    const { name } = req.body
    const newTask = new Task({
      name: name
    })

    await newTask.save()

    console.log('Task added:', newTask)
    res.redirect('tasks')
  } catch (err) {
    console.log('Error adding task:', err)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})