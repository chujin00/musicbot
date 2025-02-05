import dotenv from 'dotenv';
dotenv.config();

import { Mistral } from '@mistralai/mistralai';


export default async function handler(request, response) {
    const apiKey = process.env.MISTRAL_API_KEY;

    const client = new Mistral({apiKey: apiKey});
    
    const data = request.body;
    
    

    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{role: 'user', content: 'What is the best French cheese?'}],
    });

    console.log('Chat:', chatResponse.choices[0].message.content);



    

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

