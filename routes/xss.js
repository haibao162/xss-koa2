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
  const username = ctx.cookies.get("username");
  const token = ctx.headers.token;
  return { query, body, username, token };
};

router.all("/api/info", async (ctx, next) => {
  const username = ctx.cookies.get("username");
  const result = global.userInfo.find((info) => info.username === username);
  console.log('result', result);
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

// 支持get请求转账
router.all("/api/transfer", async (ctx, next) => {
  const { query: { toUser, money }, body, username } = getResp(ctx);
  if (toUser === username) {
    ctx.body = {
      success: false,
      message: '不能转账给自己',
      data: {},
    };
  }
  const transferUser = global.userInfo.find((info) => info.username === username);
  const receiveUser = global.userInfo.find((info) => info.username === toUser);
  console.log('transferUser', ctx.cookies.get("username"), username, transferUser);
  if (receiveUser) {
    transferUser.money -= Number(money);
    receiveUser.money += Number(money);
    console.log('global.userInfo', global.userInfo);
    ctx.body = {
      success: true,
      data: {},
    };
  } else
    ctx.body = {
      success: false,
      data: {},
    };
});

// 支持post请求转账
router.post("/api/transfer/post", async (ctx, next) => {
  const { body: { toUser, money }, username } = getResp(ctx);
  if (toUser === username) {
    ctx.body = {
      success: false,
      message: '不能转账给自己',
      data: {},
    };
  }
  const transferUser = global.userInfo.find((info) => info.username === username);
  const receiveUser = global.userInfo.find((info) => info.username === toUser);
  console.log('transferUser', ctx.cookies.get("username"), username, transferUser);
  if (receiveUser) {
    transferUser.money -= Number(money);
    receiveUser.money += Number(money);
    console.log('global.userInfo', global.userInfo);
    ctx.body = {
      success: true,
      data: {},
    };
  } else
    ctx.body = {
      success: false,
      data: {},
    };
});

router.all("/api/login", async (ctx, next) => {
  const { body } = getResp(ctx);
  const { username } = JSON.parse(body);
  const db = global.userInfo.find((info) => info.username === username);
  if (db) {
    // ctx.set("Access-Control-Allow-Credentials", true);
    ctx.cookies.set("username", username, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 25,
      expires: new Date("2030-12-31"),
      httponly: false,
    });
    ctx.body = {
      success: true,
      body,
      cookie: ctx.cookies.get("username"),
    };
  } else {
    ctx.body = {
      success: false,
      body,
      cookie: ctx.cookies.get("username"),
    };
  }
});

module.exports = router;
