export default async function handler(request, response) {

    const body_data = request.body;
    const original_url = body_data['original_url'];

    const url = ``
    const formData = new FormData();

    formData.append("reqtype", "urlupload");
    formData.append("url", original_url);

    await fetch(url, {
        method: 'POST',
        body: formData
    })
        .then((_response) => {
            if (_response.status === 200) {
                return _response.text()
            } else {
                throw new Error('Encounter an error, please try again later.');
            }
        })
        .then((_response) => {
            return response.json({
                code: 200,
                message: 'Success.',
                data: _response
            });
        })
        .catch(err => {
            return response.json({
                code: 0,
                message: err.message,
                url: original_url,
            });
        })
}