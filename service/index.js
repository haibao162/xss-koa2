const axios = require('axios');

const service = axios.create({
    baseURL: "https://open.feishu.cn", // api的base_url  process.env.BASE_API,,注意局域网访问时，不能使用localhost
    timeout: 20 * 1000 // 请求超时时间
})

function getString() {
    return service({
        url: '/string',
        method: 'get',
    });
}

function getAccessToken() {
    return service({
        url: '/open-apis/authen/v1/access_token',
        method: 'post',
    });
}


module.exports = {
    service,
    getString,
    getAccessToken,
};
