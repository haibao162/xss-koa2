const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
var cors = require("@koa/cors");
const path = require('path');

const staticFiles = require('koa-static');

const xss = require("./routes/xss");
const main = require("./routes/main");
const xss_alert = require("./routes/xss-alert");
const token = require("./routes/token");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(cors({
  credentials: true,
}));
// The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'.

app.use(staticFiles(path.resolve(__dirname, 'public')));

app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);

// routes
app.use(main.routes(), main.allowedMethods());
app.use(xss.routes(), xss.allowedMethods());
app.use(xss_alert.routes(), xss_alert.allowedMethods());
app.use(token.routes(), token.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
