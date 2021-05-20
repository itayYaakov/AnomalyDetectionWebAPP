const express = require("express");
const path = require("path");

const app = express();

app.use("/pages", express.static(path.resolve(__dirname, "..", "..", "frontend", "pages")));
app.use("/assets", express.static(path.resolve(__dirname, "..", "..", "frontend", "assets")));
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

app.get("/*", (req, res) => {
    res.redirect('/pages/index.html');
});

app.listen(5400, '127.0.0.1');
console.log("Server running...");