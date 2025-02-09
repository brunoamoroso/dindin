import pg from 'pg';

const {Pool} = pg;
export const db = new Pool({
    host: 'localhost',
    database: 'dindin',
});