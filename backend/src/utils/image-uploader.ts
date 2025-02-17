import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({path: ".env.local"});

// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// const storage = multer.memoryStorage();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/assets/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
    }
});
const imageUploader = multer({storage: storage});

export default imageUploader;

// export const uploadToSupabase = async (file: Express.Multer.File) => {
//     const bucketName = process.env.SUPABASE_BUCKET!;
//     const fileName = `uploads/${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;

//     try{
//         const{ data, error} = await supabase.storage.from(bucketName).upload(fileName, file.buffer, {contentType: file.mimetype});

//         if(error){
//             throw error;
//         }

//         const {data: publicURL, error: publicURLError} = supabase.storage.from(bucketName).getPublicUrl(fileName);

//         return publicURL.publicUrl;
//     }catch(err){
//         console.error(err);
//     }
// };