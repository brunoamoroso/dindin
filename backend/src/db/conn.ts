import * as edgedb from 'edgedb';

const clientDB = edgedb.createClient({
    instanceName: "dindindb"
});

export default clientDB;