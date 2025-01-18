import * as edgedb from 'edgedb';

const isProd = process.env.NODE_ENV === 'production';

const clientDB = edgedb.createClient({
    dsn: isProd ? process.env.EDGEDB_DSN : undefined,
    instanceName: !isProd ? 'dindindb' : undefined,
});

export default clientDB;