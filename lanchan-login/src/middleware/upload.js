const multer = require('multer');
const imageFilter = (req, file, cd) => {
    if (file.mimetype.startswish("image")) {
        cb (null, true);
    } else {
        cb("Please upload only images", fales);
    }
}


let storage = multer.diskStorage(
    {
        destination: (req,file ,cb) => {
            cb(null,_basedir + "/src/upload");
        },
        filename: (req, file ,cb) => {
            cb(null,`${Date.now()}-image-${file.originalname}`);
        }
    }
)

const uploadFile = multer({ 
    storage: storage, 
    fileFilter: imageFilter 
});

module.exports = uploadFile;