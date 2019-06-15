const express = require('express');
const router = express.Router();
const mysql = require('mysql');
// const test = require('../imageProcess/makeTag.js');

const pool = mysql.createPool({
    connectionLimit: 10000,
    host: '127.0.0.1',
    user: 'root',
    password: 'yoon1015',
    database: 'application'
});

// 폴더들을 관리하는 부분 switch/case문으로 태그 생성/ 삭제 / 수정 선택하는 방식
router.get('/gfolder', (req, res) => {
    const fn = req.query.fn;
    const folder_name = req.query.folder_name;
    const new_folder_name = req.query.new_folder_name;

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
        // // 모듈 테스트
        // case 'hello':
        //     console.log('getFolder hello');
        //     const message = test(1);
        //     console.log(message);
        //     break;

        // 폴더를 삭제
        case 'del':
            pool.query(`DELETE FROM folder WHERE folder_name = '${folder_name}'`, (err, result) => {
                if (err) {
                    console.log(err);
                    sendFail();
                } else {
                    console.log(result);
                    sendSuccess();
                }
            })
            break;

        // 폴더 이름 변경  // post로 바꿀까?
        case 'up':
            console.log('/gfolder up')
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

        // 폴더 이름&대표사진 가져오기 tab2  
        case 'read':
            console.log('/gfolder read');
            pool.query(`SELECT main_photo, folder_name FROM folder WHERE main_photo IS NOT NULL`, (err, result) => {
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

        // 하나의 폴더 클릭시 그 폴더 사진 보여주기 tab2에서 하나의 폴더 선택했을 때
        case 'readone':
        console.log('gfolder readone');
            pool.query(`SELECT folder.photo_path, photo.photo_like, photo.photo_location, photo.photo_name FROM folder, photo 
            WHERE photo.photo_path = folder.photo_path 
            AND folder.folder_name = '${folder_name}' `, (err, result) => {
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

        // tab2 -> 하나의 폴더 클릭 -> 그 폴더 내 좋아요하는 사진 보여주기
        case 'readonelike':
            pool.query(`SELECT folder.photo_path FROM folder, photo 
            WHERE folder.photo_path = photo.photo_path 
            AND folder.folder_name = '${folder_name}' 
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