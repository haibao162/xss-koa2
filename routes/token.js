const router = require('koa-router')()

router.get('/token', async (ctx, next) => {
    ctx.body = {status: 200, data: {detailList:[{name: 'rosy'}, {name: 'jack'}]}};
})

module.exports = router
