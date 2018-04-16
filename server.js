const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dist")));

const server = app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

app.get("/data", (req, res) => {
    const radarData = JSON.parse(
            fs.readFileSync(__dirname + "/dist/data/output.json", "utf-8")
        ),
        data = radarData;
    setTimeout(() => {
        res.send(data);

    }, 5000);
});