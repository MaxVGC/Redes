const express = require("express");
const cors = require("cors")
var bodyParser = require('body-parser')

const app = express();
const port = 3001;
const router = require('./src/routes');

app.use(cors({
    origin: '*',
    optionsSuccessStatus: '200'
}))

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.use(router);

app.get('/', async (req, res) => {
    res.send("Microservicio para MaxMail v1.0.0")
});

app.listen(port, () => {
    console.log("iniciado");
})