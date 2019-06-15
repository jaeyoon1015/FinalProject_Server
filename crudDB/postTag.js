const express = require('express');
const router = express.Router(); 
const mysql = require('mysql');
var bodyParser = require('body-parser');
 
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

const pool  = mysql.createPool({
    connectionLimit : 10000,
    host            : '127.0.0.1',
    user            : 'root',
    password        : 'yoon1015',
    database        : 'application'
  });
  
  
// POST METHOD - 태그 생성 / 보여주기
// url: http://ip:port/ptag
router.post('/ptag', (req, res) => {
    console.log(req);
    
    const fn = req.body.fn;
    const photo_path = req.body.photo_path;
    const tag_name = req.body.tag_name;
    const new_tag_name = req.body.new_tag_name;
    const t_flag = req.body.t_flag;

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
            switch(fn){
                // 태그 수정
                case 'up':
                console.log('/ptag fn=up');
                pool.query(`UPDATE tags SET tag_name = '${new_tag_name}'
                WHERE tag_name = '${tag_name}'  AND photo_path_t = '${photo_path}'`, (err, result) => {
                    if(err){
                        console.log('ptag error in update is ' + err);
                        sendFail();
                    }else{
                        console.log(result);
                        sendSuccess();
                    }
                })
                break;

                // 태그 삭제
                case 'del':
                console.log('/ptag fn=del');
                pool.query(`DELETE FROM tags WHERE tag_name = '${tag_name}' 
                AND photo_path_t = '${photo_path}'`, (err, result) => {
                    if(err){
                        console.log(err);
                        sendFail();
                    }else{
                        console.log(result);
                        sendSuccess();
                    }
                })
                break;
                // 태그를 생성 
                case 'create':
                console.log('/ptag fn=create'); // 1: 텍스트
                if(t_flag == 1) {
                    pool.query(`INSERT INTO tags (photo_path_t, tag_name, t_flag) VALUES ('${photo_path}', '${tag_name}',1)`, (err, result) => {
                        if(err){
                            console.log(err);
                            sendFail();
                        }else{
                            console.log(result);
                            sendSuccess();
                        }
                    })
                }
                else { // 0: 라벨
                    pool.query(`INSERT INTO tags (photo_path_t, tag_name, t_flag) VALUES ('${photo_path}', '${tag_name}',0)`, (err, result) => {
                        if(err){
                            console.log(err);
                            sendFail();
                        }else{
                            console.log(result);
                            sendSuccess();
                        }
                    })
                }
                break;


                // 태그 보여주기
                case 'read':
                console.log('/ptag fn=read');
                pool.query(`SELECT tags.tag_name, tags.t_flag, photo.photo_like 
                FROM tags, photo
                 WHERE tags.photo_path_t = photo.photo_path
                 AND tags.photo_path_t = '${photo_path}'`, (err, result) => {
                    if(err){
                        console.log(err);
                        sendFail();
                    }else{
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