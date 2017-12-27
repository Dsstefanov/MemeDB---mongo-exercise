const formidable = require('formidable')
const Image = require('./../models/ImageSchema')
const Tag = require('./../models/TagSchema')
const fs = require('fs')

module.exports = (req, res) => {
    if (req.pathname === '/addImage' && req.method === 'POST') {
        addImage(req, res)
    } else if (req.pathname === '/delete' && req.method === 'GET') {
        deleteImage(req, res)
    } else {
        return true
    }
}

function addImage(req, res) {
    "use strict"
    let form = formidable.IncomingForm()
    form.parse(req, (error, fields) => {
        if (error) {
            console.error(error.message)
            return
        }
        fields.tags = fields.tagsID.split(',')
        fields.tags.pop()
        Image.create(fields)
            .then(image => {
                let targettedImages = image.tags

                Tag.update({_id:{$in: targettedImages}}, {$push: { images: image._id}}, {multi: true})
                    .then(resolve => {
                        console.log(resolve)
                        getView(res)
                    })
                    .catch(err => {
                        console.error(err.message)
                    })
            })
            .catch(err => {
                console.error(err.message)
            })
    })

}

function deleteImage(req, res) {
    "use strict"
    Image.remove({_id: req.pathquery.id}, err => {
        if(err) {
            console.error(err.message)
        }
        getView(res)
    })
}

function getView(res){
    "use strict"
    fs.readFile('./views/index.html', (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        let dispalyTags = ''

        Tag.find({}).then(tags => {
            if(tags.length === 0){
                res.end(data)
            }
            for (let tag of tags) {
                dispalyTags += `<div class='tag' id="${tag._id}">${tag.tagName}</div>`
            }
            data = data
                .toString()
                .replace(`<div class='replaceMe'></div>`, dispalyTags)
            res.end(data)
        })
    })
}