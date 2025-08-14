const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./fn/api');
const app = express();
const { connect, disconnect } = require('./fn/db');

process.on("SIGINT", () => {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  process.exit(0);
});// const responseTime = require('response-time')
// const cache = require('./config/redis')
const resolve = file => path.resolve(__dirname, file);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(responseTime());

app.use('/api/node', api) 
app.use('/dist', express.static(resolve('../frontend/dist')));

// 基本路由测试
// app.get('/ping', (req, res) => {
//     res.send('pong')
// })

// const cache = require('./config/redis');
// (async () => {
//   await cache.set('aa', 123)
// })()

const port = process.argv[2] || 3001;

const server = app.listen(port, async () => {
    console.log('Server up: http://localhost:' + port);
    await connect(); // 统一在此处连接

    if(0){
        const db = mongoose.connection.getClient().db();

        // 获取所有数据库的列表
        const databasesList = await db.admin().listDatabases();
        console.log('可用的数据库列表:');
        databasesList.databases.forEach((database) => {
            console.log(`- ${database.name}`);
        });

        // 选择一个数据库
        const selectedDb = mongoose.connection.getClient().db('stock');

        // 获取该数据库中所有集合的列表
        const collections = await selectedDb.listCollections().toArray();
        console.log('\n指定数据库中的集合列表:');
        collections.forEach((collection) => {
            console.log(`- ${collection.name}`);
        });
    }
});

process.on('SIGINT', async () => {
    console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
    try {
        await disconnect();
        server.close(() => {
            console.log('Server gracefully shutdown');
            process.exit(0); // 确保执行退出
        });
    } catch (err) {
        console.error('Shutdown error:', err);
        process.exit(1);
    }
});