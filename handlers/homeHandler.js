const Tag = require('./../models/TagSchema')
const fs = require('fs')

module.exports = (req, res) => {
  if (req.pathname === '/' && req.method === 'GET') {
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
  } else {
    return true
  }
}
