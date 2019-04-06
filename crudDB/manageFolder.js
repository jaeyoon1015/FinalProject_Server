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

// 폴더들을 관리하는 부분 switch/case문으로 태그 생성/ 삭제 / 수정 선택하는 방식
router.get('/folder', (req, res) => {
    const crud = req.query.crud;
    const folder_name = req.query.folder_name;
    const photo_path = req.query.photo_path;
    const first_image = req.query.first_image;


    switch (crud) {
        // 폴더를 생성
        case createFolder:
            pool.query(`INSERT INTO folder (folder_name, photo_path) VALUES('${folder_name}', '${first_image}')`, (err, result) => {
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

        // 폴더를 삭제
        case deleteFolder:
            pool.query(`DELETE FROM folder WHERE folder_name = '${folder_name}'`, (err, result) => {
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

        // 폴더 이름 변경
        case updateFolder:
            pool.query(`UPDATE folder SET folder_name = '${new_folder_name}' WHERE folder_name = '${folder_name}'`, (err, result) => {
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

        // 폴더에 사진 추가
        case addPhoto:
            pool.query(`DELETE FROM folder WHERE folder_`, (err, result) => {
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