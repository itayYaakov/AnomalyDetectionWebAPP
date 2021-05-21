const path = require('path');
const express = require('express');
const host = 'localhost';
const port = 8080;
const model = require('../Model/Model.js');
const app = express();
const maxRequests = 20;
let workingRequests = 0;
let files = {};
let configs = {};


app.use(express.static(__dirname))
app.use("/pages", express.static(path.resolve(__dirname, "..", "..", "frontend", "pages")));
app.use("/assets", express.static(path.resolve(__dirname, "..", "..", "frontend", "assets")));

app.use(express.json({ limit: '100mb' }))

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "..", "frontend", "pages", "index.html"));
});

app.get("/*.html", (req, res) => {
    console.log("/* req.url = ", req.url);
    console.log("/* res.url = ", res.url);
    console.log("/* res.target = ", res.target);
    console.log("pathResolve = ", path.resolve(__dirname, "..", "..", "frontend", "pages", "404.html"));
    res.redirect('/pages/404.html');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    res.end();
})



// backend routes
app.post('/detect', async(req, res) => {
    console.log("Got /detect post request");
    if (workingRequests === maxRequests) {
        res.writeHead(429, "Server's request threshold has been reached. Please try again later");
    } else {
        workingRequests++;
        let params = getQueryParams(req);
        let body = req.body;

        if (!params) {
            res.writeHead(400, "Params is empty");
        }

        if (!body) {
            res.writeHead(400, "Body is empty");
        }

        if (params && body) {
            let testJson = body['test'];
            let trainJson = body['train'];
            let threshold = Number(params['threshold']);
            try {
                let response = await model.detect(params['algorithm'], trainJson, testJson, threshold)
                let id = Date.now();

                let anomalies = {
                    id: id,
                    anomalies: response
                }

                configs[id] = params;
                files[id] = body;
                files[id]['anomalies'] = anomalies;

                res.json(anomalies);

            } catch (error) {

                console.log(error);
                res.writeHead(417, "Model detect algorithm failed. Please try again later");
            }

        }
        workingRequests--;

    }
    res.end();
})


app.get('/reportsConfigHistory', async(req, res) => {
    res.json(configs);
    res.end();
})

app.get('/reportData', async(req, res) => {
    let params = getQueryParams(req);
    let type = params['type'];
    let data;
    if (type === 'train') {
        data = files[params['id']]['trainFile'];
    } else if (type === 'test') {
        data = files[params['id']]['testFile'];
    } else if (type === 'anomalies') {
        data = files[params['id']]['anomalies'];
    }
    res.json(data);
    res.end();
})

function getQueryParams(req) {
    var params = {};
    var baseUrl = req.protocol + '://' + req.get('host') + '/';
    var rawUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var url = new URL(rawUrl, baseUrl);
    var keyIter = url.searchParams.keys();
    var valIter = url.searchParams.values();
    var current = null;
    while ((current = keyIter.next().value) !== undefined)
        params[current] = valIter.next().value;
    return params;
}

app.use("/*", (req, res) => {
    res.redirect('/');
});

app.on('error', function(error) {
    console.log("Server can't run, error:" + error);
});

app.listen(port, host, () => {
    console.log('Server is online!')
});