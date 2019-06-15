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
  
  // photo 테이블에 사진에 대한 부분
router.get('/gphoto', (req, res) => {
    const fn = req.query.fn;
    
    const success_msg = JSON.stringify('SUCCESS');
    const fail_msg = JSON.stringify('FAIL');
          
    function sendSuccess() {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(success_msg);
        res.end();
    }

    function sendFail() {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(fail_msg);
        res.end();
    }

    switch (fn) {
       
        // 사진을 보여줌 (tab1)
        case 'read':
            pool.query(`SELECT * FROM photo`, (err, result) => {
                    if (err) {
                        console.log(err);
                        sendFail();
                    } else {
                        console.log(result);
                        // const data = JSON.parse(JSON.stringify(result));
                        // console.log(data[0].PHOTO_NAME);
                        // const data1 = data[0].PHOTO_NAME;
                        // console.log(data1);
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.send(JSON.stringify(result));
                        res.end();
                    }
                })
            break;
        
        // 좋아요 되어 있는 사진만 보여준다. // tab1에서 좋아요한 사진만 보기
        case 'readlike':
            pool.query(`SELECT photo_path, photo_name, photo_like FROM photo WHERE photo_like = 1`, (err, result) => {
                if (err) {
                    console.log(err);
                    sendFail();
                } else {
                    console.log(result);
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(JSON.stringify(result));
                    res.end();
                }
            })
            break;

    }



})
module.exports = router;