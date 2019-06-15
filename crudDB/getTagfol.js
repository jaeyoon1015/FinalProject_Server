const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10000,
    host: '127.0.0.1',
    user: 'root',
    password: 'yoon1015',
    database: 'application'
});

// 폴더들을 관리하는 부분 switch/case문으로 태그 생성/ 삭제 / 수정 선택하는 방식
router.get('/gtagFol', (req, res) => {
    const fn = req.query.fn;
    const tag_name = req.query.tag_name;

    
    const fail_msg = JSON.stringify('FAIL');
          
    function sendFail() {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(fail_msg);
        res.end();
    }

    switch (fn) {
        // 폴더 이름&대표사진 가져오기 tab3 // photo_path하나만 가져올 수 있도록 처리하기   -> 상위 4개만 나오도록 DB query 다시
        case 'read':
            pool.query(`SELECT tag_name, photo_path_t FROM tags GROUP BY tag_name ORDER BY count(photo_path_t) DESC LIMIT 4`, (err, result) => {
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

        // 하나의 태그폴더 클릭시 그 태그폴더 사진 보여주기 tab3에서 하나의 태그폴더 선택했을 때
        case 'readone':
            console.log('/getTagfol readone');
            // pool.query(`SELECT photo_path_t FROM tags WHERE tag_name = '${tag_name}'`, (err, result) => {
            pool.query(`SELECT tags.photo_path_t, photo.photo_name, photo.photo_like FROM tags, photo
             WHERE tags.photo_path_t = photo.photo_path  
             AND tag_name = '${tag_name}'`, (err, result) => {
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

        // tab3 -> 하나의 태그 폴더 클릭 -> 그 태그 폴더 내에 좋아요하는 사진 보여주기
        case 'readonelike':
            pool.query(`SELECT tags.photo_path_t FROM tags, photo 
            WHERE tags.photo_path_t = photo.photo_path 
            AND tags.tag_name = '${tag_name}'  
            AND photo.photo_like = 1 `, (err, result) => {
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