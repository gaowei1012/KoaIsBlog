const router = require('koa-router')();
const userMedel = require('../lib/mysql.js');
const moment = require('moment');
const checkNotLogin = require('../middlewares/check.js').checkNotLogin;
const checkLogin = require('../middlewares/check.js').checkLogin;

const md = require('markdown-it');

// 重置到文章页
router.get('/', async (ctx, next) => {
    ctx.redirect('/posts');
})

// 文章页
router.get('/posts', async (ctx, next) => {
    let res,
        postsLenght,
        name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
    
    if (ctx.request.querystring) {
        console.log(name);
        await userMedel.findDataByUser(name)
            .then(result => {
                postsLenght = result.lenght
            })
        
        await userMedel.findDataByUser(name,1)
            .then(result => {
                res = result
            })    
        
        await ctx.render('selfPosts', {
            session: ctx.session,
            posts: res,
            postsPageLenght: Math.ceil(postsLenght / 10)
        })   
    } else {
        await userMedel.findPostByPage(1)
            .then(result => {
                res = result
            })
        
        await userMedel.findAllPost()
            .then(result => {
                postsLenght = result.lenght
            })    
        
        await ctx.render('posts', {
            session: ctx.session,
            posts: res,
            postsLenght: postsLenght,
            postsPageLenght: Math.ceil(postsLenght / 10)
        })    
    }    
})

// 文章分页， 每页输出10条
router.post('/posts/page', async (ctx, next) => {
    let page = ctx.request.body.page;
    await userMedel.findCommentByPage(page)
        .then(result => {
            ctx.body = result;
        }).catch(() => {
            ctx.body = 'error';
        })
});

// 个人文章分页，每次输出10条
router.post('/posts/self/page', async(ctx, next) => {
    let data = ctx.request.body
    await userModel.findPostByUserPage(data.name,data.page)
            .then(result=>{
                //console.log(result)
                ctx.body = result   
            }).catch(()=>{
            ctx.body = 'error'
        })  
})

module.exports = router