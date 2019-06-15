const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10000,
    host: '127.0.0.1',
    user: 'root',
    password: 'yoon1015',
    database: 'application'
});

// 폴더들을 관리하는 부분 switch/case문으로 태그 생성/ 삭제 / 수정 선택하는 방식
router.post('/pfolder', (req, res) => {
    const fn = req.body.fn;
    const folder_name = req.body.folder_name;
    const new_folder_name = req.body.new_folder_name;
    const photo_path = req.body.photo_path;
    const main_photo = req.body.main_photo;

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
        // 폴더를 생성 // 대표 사진도 저장
        case 'create':
            console.log('pfolder create');
            // pool.query(`INSERT INTO folder (folder_name, photo_path, main_photo) 
            // VALUES('${folder_name}', '${photo_path}', '${main_photo}')`, (err, result) => {
            //     if (err) {
            //         console.log(err);
            //         sendFail();
            //     } else {
            //         console.log(result);
            //         res.setHeader("Access-Control-Allow-Origin", "*");
            //         res.send(success_msg);
            //         res.end();
            //     }
            // })
            pool.query(`SELECT photo_path FROM photo WHERE photo_path LIKE '%${photo_path}%'`, (err, result) => {
                if(err){
                    console.log('error in pfolder create select ' + err);
                    sendFail();
                } else {
                    console.log(result);
                    const data = JSON.parse(JSON.stringify(result));
                    const path_data = data[0].photo_path;
                    console.log(path_data);
                    pool.query(`INSERT INTO folder (folder_name, photo_path, main_photo) 
            VALUES('${folder_name}', '${path_data}', '${path_data}')`, (err, result) => {
                            if (err) {
                                console.log(err);
                                sendFail();
                            } else {
                                console.log(result);
                                res.setHeader("Access-Control-Allow-Origin", "*");
                                res.send(success_msg);
                                res.end();
                            }
                        })
                }
            })
            break;

        // 폴더 이름 변경
        case 'up':
            console.log('pfolder up');
            pool.query(`UPDATE folder SET folder_name = '${new_folder_name}' WHERE folder_name = '${folder_name}'`, (err, result) => {
                if (err) {
                    console.log(err);
                    sendFail();
                } else {
                    console.log(result);
                    sendSuccess();
                }
            })
            break;

        // 폴더에 사진 추가
        case 'add':
            // pool.query(`INSERT INTO folder (folder_name, photo_path) VALUES ('${folder_name}', '${photo_path}') `, (err, result) => {
            //     if (err) {
            //         console.log(err);
            //         sendFail();
            //     } else {
            //         console.log(result);
            //         sendSuccess();
            //     }
            // })
            pool.query(`SELECT photo_path FROM photo WHERE photo_path LIKE '%${photo_path}%'`, (err, result) => {
                if(err){
                    console.log('error in pfolder add select ' + err);
                    sendFail();
                } else {
                    console.log(result);
                    const data = JSON.parse(JSON.stringify(result));
                    const path_data = data[0].photo_path;
                    console.log(path_data);
                    pool.query(`INSERT INTO folder (folder_name, photo_path) 
                    VALUES('${folder_name}', '${path_data}')`, (err, result) => {
                            if (err) {
                                console.log(err);
                                sendFail();
                            } else {
                                console.log(result);
                                res.setHeader("Access-Control-Allow-Origin", "*");
                                res.send(success_msg);
                                res.end();
                            }
                        })
                }
            })
            break;

    }


})

module.exports = router;