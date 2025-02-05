export default async function handler(request, response) {
    console.log('Token endpoint hit');
    const client_id = "da496f99cb0d458d8cb36fe111d6e8d5";
    const client_secret = "c0b0cf17ea874394885c0083f1a5211d";
    /*
    const parameters= "?grant_type=client_credentials&client_id=" + client_id+ "&client_secret=" + client_secret;

    const spotify_response = await fetch('https://accounts.spotify.com/api/token' + parameters, {
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    */
    const parameters = new URLSearchParams();
    parameters.append('grant_type', 'client_credentials');

    const spotify_response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
        },
        body: parameters
    });
    
    const data = await spotify_response.json();

    return response.json(data);
}
