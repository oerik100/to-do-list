const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2002
require('dotenv').config()
const cors = require('cors')


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


app.get('/',(req, res)=>{
    db.collection('lists').find().sort().toArray()
    .then(data => {
        res.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addToDoItem', (req,res) =>{
    db.collection('lists').insertOne({toDoItem: req.body.toDoItem,
    priorityLevel: req.body.priorityLevel})
        .then(result => {
            console.log('Item Added')
            res.redirect('/')
        })
        .catch(error => console.error(error))
})




app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})