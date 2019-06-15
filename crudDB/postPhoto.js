const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
router.use(bodyParser.json({ limit: '10mb' }));


const pool = mysql.createPool({
    connectionLimit: 100000,
    host: '127.0.0.1',
    user: 'root',
    password: 'yoon1015',
    database: 'application'
});

// photo 테이블에 사진에 대한 부분
router.post('/pphoto', (req, res) => {
    const fn = req.body.fn;
    const photo_path = req.body.photo_path;
    const photo_name = req.body.photo_name;
    const photo_location = req.body.photo_location;
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
        case 'create': // photo 테이블에 사진에 관한 정보를 저장함
            console.log('pphoto create');

            pool.query(`INSERT INTO photo (photo_path, photo_name, photo_like, photo_location) 
        VALUES ('${photo_path}', '${photo_name}', 0, '${photo_location}' )`, (err, result) => {
                    if (err) {
                        console.log(err);
                        sendFail();
                    } else {
                        console.log(result);
                        sendSuccess();
                    }
                    // pool.query(`SELECT photo_path FROM photo WHERE flag = 0`, (err, result) => {
                    //     if (err) {
                    //         console.log(err);
                    //         sendFail();
                    //     } else {
                    //         console.log(result);
                    //         res.setHeader("Access-Control-Allow-Origin", "*");
                    //         res.send(JSON.stringify(result));
                    //         res.end();
                    //     }
                    // })
                })

            /*
            // 아직 이미지 분석 안된 애들 보내줌! 
            pool.query(`SELECT photo_path FROM photo WHERE flag = 0`, (err, result) => {
                if(err) {
                    console.log(err);
                    sendFail();
                } else {
                    console.log(result);
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(JSON.stringify(result));
                    res.end();
                }
            })
            */
            break;


        // 사진에서 하트 클릭했을 때 1/null 값으로 바꿔 주기
        case 'clickHeart':
            console.log('/pphoto - clickHeart');
            pool.query(`UPDATE photo SET photo_like = 1 WHERE photo_path = '${photo_path}'`, (err, result) => {
                if (err) {
                    console.log(err);
                    sendFail();
                } else {
                    console.log(result);
                    sendSuccess();
                }
            })
            break;

        // 사진에서 하트 클릭했을 때 1/null 값으로 바꿔 주기
        case 'cancelHeart':
            pool.query(`UPDATE photo SET photo_like = 0 WHERE photo_path = '${photo_path}'`, (err, result) => {
                if (err) {
                    console.log(err);
                    sendFail();
                } else {
                    console.log(result);
                    sendSuccess();
                }
            })
            break;
    }
})
module.exports = router;