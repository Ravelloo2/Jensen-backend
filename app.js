const credentials = {secretUser:"Eliaz" , secretPassword:"Ravello"}

const cors = require('cors')
const bodyParser = ('body-parser')
const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

var http = require('http')
var https = require('https')

var options = {
    key: fs.readFileSync('abels-key.pem'),
    cert: fs.readFileSync('abels-cert.pem')

}

app.use(function (req, res, next) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'");
    next();
});

app.use('/healthcheck', require('./routes/healthcheck.routes'))

app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/', (req, res) => {
    headers = {"http_status":200, "cache-control": "no-cache"}
    body = {"status": "availabe"}
    res.status(200).send(body)
})

app.get("/health", (req, res) => {
    headers = {"http_status":200, "cache-control": "no-cache"}
    body = {"status": "available"}
})

app.post('/authorize', (req, res) => {
    let user = req.body.user;
    let password = req.body.password
    console.log(`User ${user}`)
    console.log(`password ${password}`)

    if (user === credentials.secretUser && password === credentials.secretPassword) {
        console.log("Authorized")
        const token = jwt.sign({
            data: 'foobar'
        }, 'your-secret-key-here', { expiresIn: 60 * 60 });

        console.log(token)
        res.status(200).send(token) 
    } else {
        console.log("Not authorized")
        res.status(200).send({"STATUS":"FAILURE"})
    }
});

http.createServer(app).listen(8080, function() {
    console.log('HTTP listening on 8080');
});

https.createServer(options, app).listen(PORT, function() {
    console.log('HTTPS listening on 3000')
})