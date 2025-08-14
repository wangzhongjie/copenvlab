const redis = require("redis");

//连接配置
const config = {};
config.host = "127.0.0.1";
config.port = 6379;
config.password = "";

//创建客户端
const redisClient = redis.createClient(config.port, config.host);

//密码验证
if (config.password) {
    redisClient.auth(config.password, () => {
        console.log("redis auth success");
    });
}

redisClient.on("connect", function(opts) {
    console.log("redis client connect");
});

redisClient.on("error", function(error) {
    console.error("redis client on error: %s", error);
});

//monitor事件可以监听到redis接收到的所有客户端命令
redisClient.monitor(function(error, result) {
    console.log("redis client monitor: ", result); //ok
});

redisClient.on("monitor", function(time, args) {
    console.log("redis client on monitor:", time, /* args */);
});


let cache = {};

//字符串 根据键名获取键值，字符串解析为JSON对象。
cache.get = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (error, result) => {
            if (error) {
                console.log(error, result); //null null
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

//字符串 设置键值对
cache.set = (key, value, expire) => {
    if (typeof value === "object") {
        value = JSON.stringify(value);
    }
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, (error, result) => {
            if (error) {
                // console.log(error, result);
                reject(error);
            } else {
                if (result === "OK") {
                    result = true;
                }
                resolve(result);
            }
        });
        if(expire){
            redisClient.expire(key, expire) // expire秒后自动过期
        }
    });
};


//哈希散列表 获取键值对数量
cache.hlen = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.hlen(key, (error, length) => {
            if (error) {
                reject(error);
            } else {
                resolve(length);
            }
        });
    });
};
//哈希散列表 根据键名获取中所有的键值对
cache.hgetall = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.hgetall(key, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};
//哈希散列表 设置中的键值对
cache.hmset = (key, values, expire) => {
    return new Promise((resolve, reject) => {
        redisClient.hmset(key, values, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result === "OK") {
                    result = true;
                }
                resolve(result);
            }
        });
        if(expire){
            redisClient.expire(key, expire) // expire秒后自动过期
        }
    });
};
cache.hmget = (key, values) => {
    return new Promise((resolve, reject) => {
        redisClient.hmget(key, value, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};
module.exports = cache;