require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router=require('./routes/routes')
const app = express()
require('./database/connection')
const port = 3000
app.use('/uploads',express.static("uploads"))
app.use(express.json())
app.use(cors())
app.use(router)
app.get('/', (req, res) => {
    res.status(200)
    res.send("Welcome to root URL of Server")

})



app.listen(port, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + port)

    } else {
        console.log("Error occurred, server can't start", error)

    }

})
