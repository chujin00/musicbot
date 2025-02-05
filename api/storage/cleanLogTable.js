import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    connectionString: "",
})

export default async function handler(request, response) {

    let result = 'Success.';

    const client = await pool.connect()
    result = await client.query('TRUNCATE log;ALTER SEQUENCE log_id_seq RESTART WITH 1;')
    client.release()

    return response.json({
        code: 200,
        message: 'Success.'
    });
}