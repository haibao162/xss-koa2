const router = require("koa-router")();



router.all("/xss-alert", async (ctx, next) => {
    console.log('ctx', 11);
    ctx.body = {
      data: '<script>alert(1);</script>',
    };
});

router.all("/xss-alert/update", async (ctx, next) => {
    console.log('ctx', 11);
    const { request: {body}} = ctx;
    console.log('body', body);
    ctx.body = {
      data: body,
    };
});

module.exports = router;
