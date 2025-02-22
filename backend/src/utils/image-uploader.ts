import multer from 'multer';
const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "src/assets/uploads");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
//     }
// });
const imageUploader = multer({storage: storage});
export default imageUploader;