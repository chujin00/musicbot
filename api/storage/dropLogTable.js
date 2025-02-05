import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    connectionString: "",
})

export default async function handler(request, response) {

    let result = 'Success.';

    // const client = await pool.connect()
    // result = await client.query('DROP TABLE log;')
    // client.release()

    return response.json({
        code: 200,
        message: result
    });
}