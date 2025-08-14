'use strict'
const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb');
const { Models } = require('./db'); 
const db = Models; 
const dayjs = require('dayjs')
const common = require('./common')

// deal center
router.get('/deals', async (req, res, next) => {
    try {
        // let blogs = await db.Blogs.find().sort('-created_at').lean();
        // 模拟从数据库查询数据
        const deals = [
            {
                name: "沪金:250924 领口策略 776/824", 
                pnl: -2030, 
                pnlRate: "-0.25%", 
                createTime: "2025-08-11 14:26:08", 
                closeTime: null, 
                daysLeft: 41, 
                expiry: "2025-09-24"
            }, 
            {
                name: "沪银:250924 自定义策略 9200/9500", 
                pnl: 101.25, 
                pnlRate: "+0.07%", 
                createTime: "2025-08-09 11:03:58", 
                closeTime: null, 
                daysLeft: 41, 
                expiry: "2025-09-24"
            }, 
            {
                name: "螺纹钢:250924 领口策略 3250/3100", 
                pnl: -42.5, 
                pnlRate: "-0.13%", 
                createTime: "2025-08-08 21:40:00", 
                closeTime: null, 
                daysLeft: 41, 
                expiry: "2025-09-24"
            }, 
            {
                name: "rb2510领口", 
                pnl: 80, 
                pnlRate: "+10.13%", 
                createTime: "2025-08-08 21:30:00", 
                closeTime: "2025-08-08 21:40:21", 
                daysLeft: 41, 
                expiry: "2025-09-24"
            }, 
            {
                name: "沪银:250924 自定义策略 9200/9500", 
                pnl: -213.75, 
                pnlRate: "-0.15%", 
                createTime: "2025-08-08 21:07:30", 
                closeTime: null, 
                daysLeft: 41, 
                expiry: "2025-09-24"
            }
        ]
        // console.log(999999,deals)
        res.status(200).send(deals).end();
    } catch (error) {
        console.error('查询交易数据时出错:', error);
        res.status(500).send('查询交易数据时出错').end();
    }
})


module.exports = router
