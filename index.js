require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/super-chat";
var auth = require('./routes/auth');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/dist/super-chat"));

// Frontend Route
app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/dist/super-chat/index.html");
})

// Backend Routes
app.use('/auth', auth);



mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, err => {
    if (err) {
        console.log('Error in connecting to database: ', err);
    } else {
        console.log('Connected to database: ', MONGODB_URI);
    }
})

app.listen(PORT, err => {
    if (err) {
        console.log('Error in starting server: ', err);
    } else {
        console.log('Server started successfully on port: ', PORT);
    }
})