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
});

// 发表文章页
router.get('/create', async(ctx, next) => {
    await ctx.render('create', {
        session: ctx.session,
    })
});

// post 发表文章
router.post('/create', async (ctx, next) => {
    let title = ctx.request.body.title,
        content = ctx.request.body.content,
        id = ctx.session.id,
        name = ctx.session.user,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        avator,

        newContent = content.replace(/[<">']/g, (target) => { 
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        }),
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    
        await userModel.findUserData(ctx.session.user)
            .then(res => {
                console.log(res[0]['avator'])
                avator = res[0]['avator']       
        })
        await userModel.insertPost([name, newTitle, md.render(content), content, id, time,avator])
            .then(() => {
                ctx.body = true
            }).catch(() => {
                ctx.body = false
            })    

})

module.exports = router