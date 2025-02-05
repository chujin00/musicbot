import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    connectionString: "",
})

export default async function handler(request, response) {
    const id = request.body.id;
    const client = await pool.connect()
    const result = await client.query(`DELETE FROM log WHERE id = '${id}';`)
    client.release()

    return response.json({
        code: 200,
        message: 'Saved successfully.',
    });

}