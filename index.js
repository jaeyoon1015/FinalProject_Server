const http = require('http');
const express = require('express');
const app = express();
const mysql = require('mysql');
const ip = require('ip');
var cors = require('cors');

app.use(cors());

// DB
const postTag = require('./crudDB/postTag.js');

const getPhoto = require('./crudDB/getPhoto.js');
const postPhoto = require('./crudDB/postPhoto.js');

const getFolder = require('./crudDB/getFolder.js');
const postFolder = require('./crudDB/postFolder.js');

const getTagfol = require('./crudDB/getTagfol.js');

const searchTag = require('./crudDB/searchTag.js');

// IMAGE PROCESSING
const imgPro = require('./imageProcess/imgPro.js');


//const Myip = '127.0.0.1'
const Myip = ip.address();
const port = 9010;

app.listen(port, Myip, () => {
    console.log(`Server Open ${Myip}:${port}`);
})
app.get('/', (req, res) => {
    res.end('hello Server');
})

//DB 
app.post('/ptag', postTag);

app.get('/gphoto', getPhoto);
app.post('/pphoto', postPhoto);

app.get('/gfolder', getFolder);
app.post('/pfolder', postFolder);

app.get('/gtagfol', getTagfol);

app.get('/search', searchTag);

// IMAGE PROCESSING
app.post('/imgPro', imgPro);    // 실제 태그 자동 생성
//app.get('/testApi', testAPI);   // test용

// 텍스트 공유
// app.get('/imageText', imageText);
//app.post('/shareText', shareText);

