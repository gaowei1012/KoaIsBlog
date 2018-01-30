const mysql = require('mysql')
const config = require('../config/default')

const pool = mysql.createPool({
    host     : config.database.HOST,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE  
});

let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}


let users = 
    `create table if not exists users(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        pass VARCHAR(100) NOT NULL,
        avator VARCHAR(100) NOT NULL,
        moment VARCHAR(100) NOT NULL,
        PRIMARY KEY ( id )
    );`


let posts = 
    `create table if not exists posts(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    title TEXT(0) NOT NULL,
    content TEXT(0) NOT NULL,
    md TEXT(0) NOT NULL,
    uid VARCHAR(40) NOT NULL,
    moment VARCHAR(100) NOT NULL,
    comments VARCHAR(200) NOT NULL DEFAULT '0',
    pv VARCHAR(40) NOT NULL DEFAULT '0',
    avator VARCHAR(100) NOT NULL,
    PRIMARY KEY ( id )
   );`   
   
   
let comment = 
    `create table if not exists comment(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    content TEXT(0) NOT NULL,
    moment VARCHAR(40) NOT NULL,
    postid VARCHAR(40) NOT NULL,
    avator VARCHAR(100) NOT NULL,
    PRIMARY KEY ( id )
   );`

let createTable = function (sql) {
    return query(sql, [])
}


// 建表
createTable(users)
createTable(posts)
createTable(comment)



// 注册用户
let insertData = function (value) {
    let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
    return query(_sql, value);
}

// 删除用户
let deleteUserData = function (name) {
    let _sql = `delete from users where name="${name}"`
    return query(_sql);
}

// 查找用户
let findUserData = function (name) {
    let _sql = `select * from users where name="${name}"`
    return query(_sql);
}

// 发表新文章
let insertPost = function (value) {
    let _sql = "insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;"
    return query(_sql, value);
}

// 更新文章评论数
let uploadPostComment = function (value) {
    let _sql = "update posts set comments=? where id=?"
    return query(_sql, value);
}

// 更新浏览数
let updatePostPv = function (value) {
    let _sql = "update posts set pv=? where id=?"
    return query(_sql, value);
}

// 发表评论
let insertComment = function (value) {
    let _sql = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
}
























