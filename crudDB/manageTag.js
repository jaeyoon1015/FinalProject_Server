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
  
  
// 태그들을 관리하는 부분 switch/case문으로 태그 생성/ 삭제 / 수정 선택하는 방식
router.get('/tags', (req, res) => {
    const crud = req.query.crud;
    const photo_path = req.query.photo_path;
    const tag_name = req.query.tag_name;
    const new_tag_name = req.query.new_tag_name;
          
            switch(crud){
                // 태그를 생성
                case 'createTag':
                pool.query(`INSERT INTO tags (photo_path_t, tag_name) VALUES ('${photo_path}', '${tag_name}')`, (err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log(result);
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.send(result);
                        res.end();

                    }
                })
                break;

                // 태그 삭제
                case 'deleteTag':
                pool.query(`DELETE FROM tags WHERE tag_name = '${tag_name}'`, (err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log(result);
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.send(result);
                        res.end();
                    }
                })
                break;

                // 태그 수정
                case 'updateTag':
                pool.query(`UPDATE tags SET tag_name = '${new_tag_name}' WHERE tag_name = '${tag_name}'`, (err, result) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log(result);
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.send(result);
                        res.end();
                    }
                })
                break;

                // 태그 보여주기
                case 'showTag':
                pool.query(`SELECT tag_name FROM tags WHERE photo_path_t = '${photo_path}'`, (err, result) => {
                    if(err){
                        console.log(err);
                    }else{
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