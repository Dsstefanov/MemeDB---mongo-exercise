'use strict'
const mongoose = require('mongoose')
const promise = require('es6-promise')
mongoose.Promise = promise

let connectionString = 'mongodb://localhost/exercise'
mongoose.connect(connectionString, {useMongoClient: true})
