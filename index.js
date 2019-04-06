const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql');
const ip = require('ip');

const manageTag = require('./crudDB/manageTag.js');
const managePhoto = require('./crudDB/managePhoto.js');
const manageFolder = require('./crudDB/manageFolder.js');
const searchTag = require('./crudDB/searchTag.js');

const Myip = '127.0.0.1'
//const Myip = ip.address();
const port = 9000;

http.createServer(app).listen(port, Myip, (error)=> {
    if(error)console.log(error);
    else console.log(`Server Open ${Myip}:${port}`);
});


app.get('/', (req, res) => {
    res.end('hello Server');
})

app.get('/tags', manageTag);
app.get('/photo', managePhoto);
app.get('/folder', manageFolder);
app.get('/search', searchTag);


// app.get('/test', (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     data = JSON.stringify('hello');
//     res.send(data);
// })