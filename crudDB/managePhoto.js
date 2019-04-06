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
router.get('/photo', (req, res) => {
    const action = req.query.action;
    const photo_path = req.query.photo_path;
    const photo_name = req.query.photo_name;
    const photo_place = req.query.photo_place;
    const photo_like = req.query.photo_like;

    switch (action) {
        case insertPhoto: // photo 테이블에 사진에 관한 정보를 저장함
            pool.query(`INSERT INTO photo (photo_path, photo_name, photo_place) 
                VALUES ('${photo_path}', '${photo_name}', '${photo_place}')`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.send(result);
                        res.end();
                    }
                })
            break;

        // 사진에서 하트 클릭했을 때 1/null 값으로 바꿔 주기
        case clickHeart:
            pool.query(`UPDATE photo SET photo_like = ${photo_like} WHERE photo_path = '${photo_path}`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(result);
                    res.end();
                }
            })
            break;

    }



})
module.exports = router;