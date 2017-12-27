const fs = require('fs')
module.exports = (request, response) => {
    if (request.pathname.startsWith('/public') ||
        request.pathname.startsWith('/views')
    ) {
        fs.readFile('.' + request.pathname, (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                if (request.pathname.endsWith('.css')) {
                    response.writeHead(200, {
                        'content-type': 'text/css'
                    })
                    response.write(data)
                    response.end()
                } else if (request.pathname.endsWith('.js')) {
                    response.writeHead(200, {
                        'content-type': 'application/javascript'
                    })
                    response.write(data)
                    response.end()
                } else if (request.pathname.endsWith('.html')) {
                    response.writeHead(200, {
                        'content-type': 'text/html'
                    })
                    response.write(data)
                    response.end()
                } else if (request.pathname.endsWith('.jpg')) {
                    response.writeHead(200, {
                        'content-type': 'image/jpeg'
                    })
                    response.write(data)
                    response.end()
                } else if (request.pathname.endsWith('.png')) {
                    response.writeHead(200, {
                        'content-type': 'image/png'
                    })
                    response.write(data)
                    response.end()
                } else {
                return
            }
        })
    } else {
        return
    }
}