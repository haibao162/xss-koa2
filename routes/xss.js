const router = require("koa-router")();

global.userInfo = [
  {
    username: "yangjiaxing",
    id: 1,
    money: 1000,
  },
  {
    username: "yang",
    id: 2,
    money: 2000,
  },
  {
    username: "hacker",
    id: 3,
    money: 10000,
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

// router.get("/", async (ctx, next) => {
//   console.log(1);
//   await ctx.render("xss", {
//     title: "Hello Koa 2!",
//   });
// });

router.get("/login", async (ctx, next) => {
  console.log("!2", ctx.cookies.get("username"));
  if (ctx.cookies.get("username")) {
    ctx.body = {
      success: true,
    };
  } else
    ctx.body = {
      success: false,
    };
});

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
  // const username = ctx.cookies.get("username");
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

router.all("/api/login", async (ctx, next) => {
  // console.log(getResp(ctx));
  const { body } = getResp(ctx);
  const { username } = JSON.parse(body);
  console.log("!1", ctx.cookies.get("username"));
  const db = global.userInfo.find((info) => info.username === username);
  console.log("db");
  if (db) {
    ctx.set("Access-Control-Allow-Credentials", true);
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
