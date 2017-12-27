'use strict'
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let tagSchema = new mongoose.Schema({
    tagName: {type: String, required: true},
    images: [{type: ObjectId, ref: 'Image'}]
})
tagSchema.pre('save', function (next) {
    this.tagName = this.tagName.toLowerCase()
    next()
})

module.exports = mongoose.model('Tag', tagSchema)