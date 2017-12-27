const formidable = require('formidable')
const fs = require('fs')
const Tag = require('./../models/TagSchema')

let badPractice = (res) => {
    "use strict"
    fs.readFile('./views/index.html', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        let dispalyTags = ''

        let dataFlag = false
        Tag.find({}).then(tags => {
            if(tags.length === 0){
                res.end(data)
                return
            }
            for (let tag of tags) {
                dispalyTags += `<div class='tag' id="${tag._id}">${tag.tagName}</div>`
            }
            data = data
                .toString()
                .replace(`<div class='replaceMe'></div>`, dispalyTags)
            res.write(data)
            dataFlag = true;
            res.end()
        }).catch(err => {
            res.end(data)
        })
    })
}

module.exports = (req, res) => {
    if (req.pathname === '/generateTag' && req.method === 'POST') {
        let form = formidable.IncomingForm()
        form.parse(req, (err, fields, file) => {
            "use strict"
            if (err) {
                console.error(err)
                return
            }
            Tag.create(fields).then(tag => {
                badPractice(res)
            }).catch(err => {
                console.error(err.message)
            })

        })

    } else {
        return true
    }
}
