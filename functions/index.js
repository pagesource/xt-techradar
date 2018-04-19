const functions = require('firebase-functions');
const fs = require('fs');
const express = require('express');
const app = express();


app.get('/data', (req, res) => {
    const radarData = JSON.parse(
        fs.readFileSync('./data/output.json', 'utf-8')
    );
    res.send(radarData);
});

exports.data = functions.https.onRequest(app);