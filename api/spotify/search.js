function msToTime(duration) {
    let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (hours === "00") {
        return minutes + ":" + seconds;
    } else {
        return hours + ":" + minutes + ":" + seconds;
    }


}

export default async function handler(request, response) {
    console.log('Search endpoint hit');
    // const fetch = require('node-fetch')
    const authorization = request.headers['authorization']
    const keywords = request.body['keywords'];
    const k = request.body['k'];

    const type = 'track'
    const limit = k === undefined ? 10 : parseInt(k)
    const offset = 0

    if (authorization === null || authorization === "") {
        return response.json({
            code: 0,
            message: "You don’t have a valid token."
        });
    }

    if (keywords === undefined || keywords === "") {
        return response.json({
            code: 0,
            message: "Please enter a keyword."
        });
    }

    const parameters= `?q=${keywords}&type=${type}&limit=${limit}&offset=${offset}`;

    const api_response = await fetch('https://api.spotify.com/v1/search' + parameters, {
        method: 'GET',
        headers: {
            'Authorization': authorization,
            // 'Content-Type': "application/json",
        }
    });
    const data = await api_response.json();

    if (data['error'] !== undefined) {
        return response.json({
            code: 0,
            message: data['error']['message']
        });
    }

    const _items = data['tracks']['items']
    let items = []
    for (const item of _items) {
        items.push({
            artists: item['artists'],
            id: item['id'],
            name: item['name'],
            duration_ms: msToTime(item['duration_ms']),
            preview_url: item['preview_url'],
            album: {
                name: item['album']['name'],
                images: item['album']['images'],
                release_date: item['album']['release_date'],
            }
        })
    }

    const result = {
        code: 200,
        items: items,
        limit: data['tracks']['limit'],
        offset: data['tracks']['offset'],
        total: data['tracks']['total']
    }

    return response.json(result);

}
