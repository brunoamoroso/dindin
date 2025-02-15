import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

const {Pool} = pg;

export const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});