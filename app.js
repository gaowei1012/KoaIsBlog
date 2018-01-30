const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const ejs = require('ejs')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const router = require('koa-router')
const views = require('koa-views')
const staticCache = require('koa-static')

const config = require('./config/default')

const app = new Koa()

// session储存配置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig)
}))

// 配置静态资源加载中间件
app.use(staticCache(path.join(__dirname, 'public'), {dynamic: true}, {
    maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, 'images'), {dynamic: true}, {
    maxAge: 365 * 24 * 60 * 60
}))

// 配置服务端渲染引擎
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

app.use(bodyParser({
    formLimit: 'lmb'
}))

// 路由配置
app.use(require('./routes/signin.js').routes());
app.use(require('./routes/signup.js').routes());
app.use(require('./routes/posts.js').routes());

app.listen(config.port, () => {
    console.log('SUCCESS')
})