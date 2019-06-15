const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const base64Img = require('base64-img');

router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());
router.use(bodyParser.json({ limit: '10mb' }));


const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const { Translate } = require('@google-cloud/translate');
const projectId = 'imageprocess-236903';
const translate = new Translate({ projectId });
const client = new vision.ImageAnnotatorClient();

const translateTag = require('./translateTag.js');

const pool = mysql.createPool({
    connectionLimit: 100000,
    host: '127.0.0.1',
    user: 'root',
    password: 'yoon1015',
    database: 'application'
});

router.post('/imgPro', (req, res) => {
    console.log('/imgPro ');
    const photo_path = req.body.photo_path;
    const result = req.body.result;

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

    console.log(photo_path);
    //1. result parsing and translate "label", "landmark"
    //console.log('result ' + result);
    const json_data = JSON.stringify(result);
    //console.log('json_data ' + json_data);
    const parse_data = JSON.parse(json_data);
    //console.log(parse_data.responses[0].labelAnnotations.length);  // 5
    //console.log(parse_data.responses[0].labelAnnotations[0].description);// dog

    var data = parse_data.responses[0];
    console.log(data);
    
    if(JSON.stringify(data).includes('labelAnnotations'))
    {
        // 라벨 인지
        for (let i = 0; i < parse_data.responses[0].labelAnnotations.length; i++) {
            if (parse_data.responses[0].labelAnnotations[i].score > 0.7)  // 정확도 70퍼센트 이상일 때 출력함
            {
                console.log('labelAnnotation'+ parse_data.responses[0].labelAnnotations[i].description);
                const label_en = parse_data.responses[0].labelAnnotations[i].description;
                const message = translateTag(photo_path, label_en);
                if (message == 'SUCCESS') {
                    console.log('SUCCESS translate & insert');
                } else {
                    console.log('ERROR t&i');
                }
            
            }
        }
    }

    if(JSON.stringify(data).includes('landmarkAnnotations'))
    {
        // 랜드마크 인지
        for (let i = 0; i < parse_data.responses[0].landmarkAnnotations.length; i++) {
            if (parse_data.responses[0].landmarkAnnotations[i].score > 0.6)  // 정확도 70퍼센트 이상일 때 출력함
            {
                console.log('landmarkAnnotations: ' + parse_data.responses[0].landmarkAnnotations[i].description);
                const landmark_en = parse_data.responses[0].landmarkAnnotations[i].description;
                const message = translateTag(photo_path, landmark_en);
                if (message == 'SUCCESS') {
                    console.log('SUCCESS translate & insert');
                } else {
                    console.log('ERROR t&i');
                }
            }
        }
    }

    if(JSON.stringify(data).includes('logoAnnotations'))
    {
        // 로고 인지
        for (let i = 0; i < parse_data.responses[0].logoAnnotations.length; i++) {
            if (parse_data.responses[0].logoAnnotations[i].score > 0.5)  // 정확도 70퍼센트 이상일 때 출력함
            {
                console.log('logoAnnotations: ' + parse_data.responses[0].logoAnnotations[i].description);
                const logo=parse_data.responses[0].logoAnnotations[i].description;
                insertTag(logo);
            }
        }
    }

    // 텍스트 인지
    if (JSON.stringify(data).includes('textAnnotations')) {
        console.log('textAnnotations : ' + parse_data.responses[0].textAnnotations[0].description);
        // const textData = parse_data.responses[0].textAnnotations[0].description;
        // insertTextTag(textData);

        var data = parse_data.responses[0].textAnnotations[0].description;
        var data_array = data.split('\n');
        for (let i = 0; i < data_array.length; i++) {
            console.log(' split test: ' + data_array[i]);
            insertTextTag(data_array[i]);
        }
    }

    // if (JSON.stringify(data).includes('fullTextAnnotation')) {
    //     console.log('there is fullTextAnnotation');
    //     // 텍스트 인지
    //     // for (let i = 0; i < parse_data.responses[0].textAnnotations.length; i++) {
    //     //     if (parse_data.responses[0].textAnnotations[i].score > 0.7)  // 정확도 70퍼센트 이상일 때 출력함
    //     //     {
    //     //         console.log('textAnnotations' + parse_data.responses[0].textAnnotations[i].description);
    //     //         const text = parse_data.responses[0].textAnnotations[i].description;
    //     //         insertTag(text);
    //     //     }
    //     // }

    //     //console.log( 'fullTextAnnotation' + parse_data.responses[0].fullTextAnnotation.text);
    // }


    //2. insert tag table // label
    // 라벨 태그 저장 (t_flag = 0)
    function insertTag(tags) {
        pool.query(`INSERT INTO tags (photo_path_t, tag_name, t_flag) VALUES ('${photo_path}', '${tags}', 0)`, (err, result) => {
            if (err) {
                console.log('error in insert label.description to DB' + err);
            } else {
                console.log(`${tags} ---> DB`);
            }
        })
    }

    // 텍스트 태그 저장 (t_flag = 1)
    function insertTextTag(tags) {
        pool.query(`INSERT INTO tags (photo_path_t, tag_name, t_flag) VALUES ('${photo_path}', '${tags}', 1)`, (err, result) => {
            if (err) {
                console.log('error in insert label.description to DB' + err);
            } else {
                console.log(`${tags} ---> DB`);
            }
        })
    }

    // //3. photo테이블 flag 1로 변경
    // pool.query(`UPDATE photo SET flag = 1 WHERE photo_path = '${photo_path}'`, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         sendFail();
    //     } else {
    //         console.log(result);
    //         sendSuccess();
    //     }
    // })


})
module.exports = router;