const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const Blogs_blogSchema = new Schema({
    title: String,
    content: String,
    created_at: { type: Date, default: Date.now }, //创建时间
}, { versionKey: false });

const Models = {
    Blogs: mongoose.model('Blogs', Blogs_blogSchema, 'blogs_blog'), // 
}

exports.Models = Models