const router = require("koa-router")();

global.userInfo = [
  {
    username: "yangjiaxing",
    id: 1,
    money: 100,
  },
  {
    username: "yang",
    id: 2,
    money: 200,
  },
];

export const getResp = (ctx) => {
  const {
    query,
    request: { body },
  } = ctx;
  const id = ctx.cookies.get("username");
  const token = ctx.headers.token;
  return { query, body, id, token };
};

router.get("/", async (ctx, next) => {
  console.log(1);
  await ctx.render("xss", {
    title: "Hello Koa 2!",
  });
});

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

router.post("/api/info", async (ctx, next) => {
  const username = ctx.cookies.get("username");
  const result = global.userInfo.find((info) => info.username === username);
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

router.post("/api/login", async (ctx, next) => {
  // console.log(getResp(ctx));
  const { body } = getResp(ctx);
  const { username } = JSON.parse(body);
  console.log("!1", ctx.cookies.get("username"));
  const db = global.userInfo.find((info) => info.username === username);
  console.log("db");
  if (db) {
    ctx.cookies.set("username", username, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24,
      expires: new Date("2030-12-31"),
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
