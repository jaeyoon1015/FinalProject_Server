const express = require('express');
const router = express.Router(); 
const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10000,
    host            : '127.0.0.1',
    user            : 'root',
    password        : 'yoon1015',
    database        : 'application'
  });
  
  // 태그 검색하는 부분
router.get('/search', (req, res) => {
    const tag = req.query.tag;

    pool.query(`SELECT photo_path FROM tags WHERE tag_name = '${tag}'`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result);
            res.end();
        }
    })
})
module.exports = router;