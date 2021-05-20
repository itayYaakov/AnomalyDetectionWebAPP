
//const fs = require('fs')
const path = require('path')
const express = require('express')
const host = 'localhost'
const port = 8080
const model = require('../Model/Model.js')
const app = express()
const maxRequests = 20
let workingRequests = 0
let files = {}
let configs = {}
app.use(express.static(__dirname))
app.use(express.json({limit : '100mb'}))
app.listen(port, host, () => {
    console.log('Server is online')
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
    res.end()
})


app.post('/detect', async (req, res) => {
    if (workingRequests === maxRequests) {
        res.writeHead(429, "Server's request threshold has been reached. Please try again later")
    } else {
        workingRequests++
        let params = getQueryParams(req)
        let id = Date.now()
        configs[id] = {
            'algorithm' : params['algorithm'],
            'threshold' : params['threshold'],
            'time' : params['time'],
            'trainFileName' : params['trainFileName'],
            'testFileName' : params['testFileName']
        }
        let body = req.body
        files[id] = {
            'trainFile' : body['train'],
            'testFile' : body['test']
        }
        let anomalies = await model.detect(configs[id]['algorithm'], body['train'], body['test'], id, configs[id]['threshold'])
        files[id]['anomalies'] = anomalies
        res.json(anomalies)
        workingRequests--
    }
    res.end()
})


app.get('/reportsConfigHistory', async (req, res) => {
    res.json(configs)
    res.end()
})

app.get('/reportData', async (req, res) => {
    let params = getQueryParams(req)
    let type = params['type']
    let data
    if (type === 'train') {
        data = files[params['id']]['trainFile']
    } else if (type === 'test') {
        data = files[params['id']]['testFile']
    } else {
        data = files[params['id']]['anomalies']
    }
    res.json(data)
    res.end()
})

function getQueryParams(req) {
    var params = {}
    var baseUrl = req.protocol + '://' + req.get('host') + '/'
    var rawUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var url = new URL(rawUrl, baseUrl)
    var keyIter = url.searchParams.keys(), valIter = url.searchParams.values()
    var current = null
    while ( (current = keyIter.next().value) !== undefined )
        params[current] = valIter.next().value
    return params
}
