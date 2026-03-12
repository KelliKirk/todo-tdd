require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todo.routes')

const app = express()
app.use(express.json())
app.use("/todos", todoRoutes)

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message} )
} )

app.get('/', (req, res) => {
    res.send('express test')
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(3015, () => {
            console.log('server is running')
        })
    })
    .catch(err => console.log(err))

module.exports = app