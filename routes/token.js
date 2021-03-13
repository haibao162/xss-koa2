const router = require("koa-router")();

global.userInfo = [
  {
    username: "yangjiaxing",
    id: 1,
    money: 1000,
    token: 'AS2SDWEF_ERF',
  },
  {
    username: "yang",
    id: 2,
    money: 2000,
    token: 'BPWEQQWQWWQW',
  },
  {
    username: "hacker",
    id: 3,
    money: 10000,
    token: 'QWEWEFFSDDSD',
  },
];

export const getResp = (ctx) => {
  const {
    query,
    request: { body },
  } = ctx;
  const token = ctx.headers.token;
  return { query, body, token };
};

router.all("/token/info", async (ctx, next) => {
  const { token } = getResp(ctx);
  console.log('token', token);
  const result = global.userInfo.find((info) => info.token === token);
  if (result) {
    ctx.body = {
      success: true,
      data: result,
    };
  } else
    ctx.body = {
      success: false,
      data: {},
    };
});

// 支持post请求转账
router.all("/token/transfer", async (ctx, next) => {
  const { body: { toUser, money } = {}, token } = getResp(ctx);
  console.log('token', token);
  if (!token) {
    ctx.body = {
      success: false,
      message: '没有登录态',
      data: {},
    };
    return;
  }
  const transferUser = global.userInfo.find((info) => info.token === token);
  const receiveUser = global.userInfo.find((info) => info.username === toUser);
  if (receiveUser && transferUser) {
    transferUser.money -= Number(money);
    receiveUser.money += Number(money);
    ctx.body = {
      success: true,
      data: {
        transferUser,
        receiveUser
      },
    };
  } else
    ctx.body = {
      success: false,
      data: {},
      message: '转账失败',
    };
});

router.all("/token/login", async (ctx, next) => {
  const { body } = getResp(ctx);
  const { username } = JSON.parse(body);
  const db = global.userInfo.find((info) => info.username === username);
  if (db) {
    ctx.body = {
      success: true,
      token: db.token,
    };
  } else {
    ctx.body = {
      success: false,
      token: '',
    };
  }
});

module.exports = router;
