/**
 *  验证是否登录模块
 */

 module.exports = {
     // 已经登录
     checkNotLogin: (ctx) => {
        if (ctx.session && ctx.session.user) {
            ctx.redirect('/posts');
            return false;
        }
        return true;
     },

     // 没有登录
     checkLogin: (ctx) => {
        if (!ctx.session || !ctx.session.user) {
            ctx.redirect('/signin');
            return false;
        }
        return true;
     }      
 }