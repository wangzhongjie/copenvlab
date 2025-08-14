'use strict'
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { Models } = require('./dbCommon');

// const username='xxx'
// , password='xxx'
const dbHost = `mongodb://192.168.31.158:27017/stock`;


const option = { 
    authSource: 'stock',  // 指定认证数据库
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 30000, // 连接超时时间
    // socketTimeoutMS: 45000, // 套接字超时时间
    // maxTimeMS: 60000 // 新增：所有操作的最大执行时间(毫秒)
};

// 导出连接方法
const connect = () => {
    mongoose.set("strictQuery", true);
    return mongoose.connect(dbHost, option)
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.error('Connection error:', err));
};

// 导出断开方法
const disconnect = () => {
    return mongoose.connection.close()
        .then(() => console.log('Database disconnected'))
        .catch(err => console.error('Disconnection error:', err));
};

module.exports = { 
    Models,
    connect,
    disconnect
};