import multer from 'multer';
import path from 'path';

// const uploadsDir = path.join(__dirname, '../uploads/');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
    }
});

const imageUploader = multer({storage: storage});

export default imageUploader;