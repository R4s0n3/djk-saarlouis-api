    const aws = require('aws-sdk');
    const multer = require('multer');
    const multerS3 = require('multer-s3');
    const { v4: uuidv4 } = require('uuid');

    
const MIME_TYPE_MAP ={
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'

}

aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'eu-central-1'
});

var s3 = new aws.S3();


var fileUpload = multer({
    limits: 500000,
    
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, Object.assign({}, req.body));
          },  
        key: function (req, file, cb) {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null,uuidv4()+'.'+ext);
        }
       
        
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!')
        cb(error, isValid)
    }
});

module.exports = fileUpload;