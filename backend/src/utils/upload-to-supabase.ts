import dotenv from 'dotenv';
import path from 'path';
import { supabaseClient } from './supabaseClient';

dotenv.config({path: '.env.local'});
const supabase = supabaseClient();

export const uploadToSupabase = async (file: Express.Multer.File): Promise<string> => {
    const bucketName = process.env.SUPABASE_BUCKET!;
    const fileName = String(`${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`);
    const dest = `assets/uploads/${fileName }`;

    try{
        const{ data, error} = await supabase.storage.from(bucketName).upload(dest, file.buffer, {contentType: file.mimetype});

        if(error){
            throw error;
        }

        return fileName;
    }catch(err){
        console.error(err);
        return "";
    }
}