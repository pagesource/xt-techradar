const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

app.get('/data', (req, res) => {
    const radarData = JSON.parse(
            fs.readFileSync(__dirname + '/dist/data/output.json', 'utf-8')
        ),
        data = radarData;
    setTimeout(() => {
        res.send(data);

    }, 5000);
});