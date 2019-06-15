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
    const fail_msg = JSON.stringify('FAIL');

    function sendFail() {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(fail_msg);
        res.end();
    }
    // photo_name, photo_like
    // pool.query(`SELECT photo_path_t FROM tags WHERE tag_name like '%${tag}%'`, (err, result) => {  // 앞 뒤로 공백문자 허용
    //     if (err) {
    //         console.log(err);
    //         sendFail();
    //     } else {
    //         console.log(result);
    //         res.setHeader("Access-Control-Allow-Origin", "*");
    //         res.send(result);
    //         res.end();
    //     }
    // })

    pool.query(`SELECT photo.photo_path, photo.photo_like, photo.photo_name , photo.photo_location
    FROM tags, photo 
    WHERE tags.photo_path_t = photo.photo_path AND tags.tag_name like '%${tag}%' GROUP BY photo.photo_path`, (err, result) => {  // 앞 뒤로 공백문자 허용
        if (err) {
            console.log(err);
            sendFail();
        } else {
            console.log(result);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(result);
            res.end();
        }
    })
})
module.exports = router;