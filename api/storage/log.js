import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    connectionString: "",
})

export default async function handler(request, response) {
    const data = JSON.stringify(request.body);
    const createTime = (Date.now() / 1000 | 0).toString()

    const client = await pool.connect()
    const result = await client.query(`INSERT INTO log (content, create_time) VALUES ('${data}', '${createTime}') returning id;`)
    client.release()

    if (result.rows.length > 0) {
        return response.json({
            code: 200,
            message: 'Saved successfully.',
            data: {
                id: result.rows[0].id,
            }
        });
    } else {
        return response.json({
            code: 0,
            message: 'Failed to create log.'
        });
    }


}