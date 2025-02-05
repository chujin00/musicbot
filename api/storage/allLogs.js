import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    connectionString: "",
})

export default async function handler(request, response) {
    const client = await pool.connect()
    const result = await client.query(`SELECT * FROM log`)
    client.release()

    return response.json({
        code: 200,
        message: 'Saved successfully.',
        data: result
    });
}