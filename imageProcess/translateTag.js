const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const { Translate } = require('@google-cloud/translate');
const mysql = require('mysql');
const projectId = 'imageprocess-236903';
const translate = new Translate({ projectId });
const client = new vision.ImageAnnotatorClient();

const pool = mysql.createPool({
    connectionLimit: 100000,
    host: '127.0.0.1',
    user: 'root',
    password: 'yoon1015',
    database: 'application'
});

module.exports = function (photo_path, EngTag) {    //사진 이름, 사진 위치

    // if (imgPath == 1) {
    //     console.log('we get 1');
    // }
    // return 'SUCCESS';

    // // 긴 텍스트 반환
    // async function detectTextFile() {
    //     const [result] = await client.documentTextDetection(imgPath);
    //     const fullTextAnnotation = result.fullTextAnnotation;
    //     console.log(`Full text: ${fullTextAnnotation.text}`);
    //     insertTag(fullTextAnnotation.text);
    // }
    // detectTextFile().catch(error => {
    //     console.log(error);
    // })

    // //Performs label detection on the image file // 라벨 인식
    // async function findLabel() {
    //     const [result] = await client.labelDetection(imgPath);  // 여기에 사진 위치를 넣는다!
    //     const labels = result.labelAnnotations;
    //     console.log('Labels(아직 영어인 상태):');
    //     labels.forEach(label => {
    //         console.log(label.description);
    //         translateToKor(label.description);
    //     });
    // }
    // findLabel().catch(error => {
    //     console.log(error);
    // })

    // 라벨 무조건 영어로 됨 -> 한국어로 번역하는 부분
    async function translateToKor(EngTag) {
        const target = 'ko';
        const [korTag] = await translate.translate(EngTag, target);
        console.log(`#translate ${EngTag} ----> ${korTag}`);
        insertTag(korTag);
    }
    translateToKor(EngTag).catch(err => {
        console.log('ERROR IN TRANSLATING : ' + err);
    })

    // // 로고 인식
    // async function findLogo() {
    //     const [result] = await client.logoDetection(imgPath);
    //     const logos = result.logoAnnotations;
    //     console.log('Logos:');
    //     logos.forEach(logo => console.log(logo.description));
    //     insertTag(logo.description);
    // }
    // findLogo().catch(err => {
    //     console.error('ERROR IN FINDING LOGO: ' + err);
    // })

    // // 랜드마크 인식
    // async function findLandmarks() {
    //     const [result] = await client.landmarkDetection(imgPath);
    //     const landmarks = result.landmarkAnnotations;
    //     console.log('Landmarks:');
    //     landmarks.forEach(landmark => {
    //         console.log(landmark.description);
    //         insertTag(landmark.description);
    //     });
    // }
    // findLandmarks().catch(err => {
    //     console.error('ERROR IN FINDING LANDMARKS: ' + err);
    // })

    // 태그 DB에 저장하는 함수
    async function insertTag(tags){
        await pool.query(`INSERT INTO tags (photo_path_t, tag_name, t_flag) VALUES ('${photo_path}', '${tags}', 0)`, (err, result) => {
            if (err) {
                console.log('error in insert label.description to DB' + err);
            } else {
                console.log(`${tags} ---> DB`);
            }
        })
    }

    return 'SUCCESS';

}