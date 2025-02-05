import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    connectionString: "",
})

export default async function handler(request, response) {

    let result = 'Success.';

    const client = await pool.connect()
    result = await client.query('CREATE TABLE log (ID SERIAL PRIMARY KEY, content text NOT NULL, create_time char(64) NOT NULL);')
    client.release()

    return response.json({
        code: 200,
        message: result
    });
}