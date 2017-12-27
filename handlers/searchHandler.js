const fs = require('fs')
const Tag = require('./../models/TagSchema')

module.exports = (req, res) => {
    if (req.pathname === '/search') {
        fs.readFile('./views/results.html', (err, html) => {
            "use strict"
            if (err) {
                console.error(err.message)
                return
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            })

            let query = {}
            if(req.pathquery.tagName){
                query.tagName = req.pathquery.tagName
            }
            let imageQuery ={}
            if(req.pathquery.beforeDate){
                imageQuery.$lte = req.pathquery.beforeDate
            }
            if(req.pathquery.afterDate){
                imageQuery.$gte = req.pathquery.afterDate
            }
            if(Object.keys(imageQuery).length === 0 && imageQuery.constructor === Object){
                imageQuery = null
            }
            Tag.find(query).populate({
                path: 'images',
                match: { creationDate:  imageQuery }
            })
                .sort('-creationDate')
                .then(tags => {
                    showContent(tags, html, req.pathquery, res)
                }).catch(err => {
                console.error(err.message)
            })
        })
    } else {
        return true
    }
}

function showContent(tags, html, queryString, res) {
    "use strict"

    let data = ''
    let counter = 0
    tags.forEach(tag => {
        tag.images
            .forEach(image => {
            if (queryString.Limit) {
                if (counter < parseInt(queryString.Limit)) {
                    data += (`<fieldset><legend>${image.imageTitle}</legend><img src="${image.imageUrl}"><p>${image.description}</p><button onclick='location.href="/delete?id=${image._id}"' class="deleteBtn">Delete</button></fieldset>`)
                    counter++
                }
            } else {
                data += (`<fieldset><legend>${image.imageTitle}</legend><img src="${image.imageUrl}"><p>${image.description}</p><button onclick='location.href="/delete?id=${image._id}"' class="deleteBtn">Delete</button></fieldset>`)
            }
        })
    })

    html = html
        .toString()
        .replace(`<div class='replaceMe'></div>`, data)

    res.end(html)
}
