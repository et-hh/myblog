/* eslint-disable no-console */
const express = require('express')
const apiBlog = require('./apiBlog')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb://localhost:27017/test')

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // we're connected!
})

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/apiBlog', apiBlog)
app.listen(3001,() => {
  
})


