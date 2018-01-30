/**
 *  注册模块
 */
const router = require('koa-router')
const userModel = require('../lib/mysql')
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const checkLogin = require('../middlewares/check').checkLogin
const moment = require('moment')
const fs  = require('fs')

// 注册页面
router.get('/signup', async (ctx, next) => {
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        session: ctx.session
    })
})

module.exports = router