export default async function handler(request, response) {
    const gpt_version = "gpt-35-turbo"
    const api_version = "2024-02-15-preview"
    const url = ``


    const data = request.body;

    const fetch_response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'api-key': ''
            // 'api-key': ''
        },
        body: JSON.stringify(data)
    });
    const result = await fetch_response.json();

    return response.json(result);
}