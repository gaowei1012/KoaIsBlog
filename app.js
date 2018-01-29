const Koa = require('koa')

const app = new Koa()


app.use(ctx => {
    ctx.body = 'Koa+Node+MySql'
})

app.listen(3000, () => {
    console.log('SUCCESS')
})