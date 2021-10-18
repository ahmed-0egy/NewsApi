const multer = require('multer');
const uploadImage = multer({
    limits:{
        fileSize: 3000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif|JPG|JPEG|PNG|JFIF)$/))
            cb(new Error('Please upload an image'));
        cb(null, true);
    }
});

module.exports = uploadImage;