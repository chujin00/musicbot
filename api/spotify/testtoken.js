import handler from './token.js';

// 模拟 request 和 response 对象
const mockRequest = {
    headers: {}, // 如果有需要，可以添加模拟头部
};

const mockResponse = {
    json: (data) => {
        console.log('Response:', data); // 打印返回的 JSON 数据
    }
};

handler(mockRequest, mockResponse);
