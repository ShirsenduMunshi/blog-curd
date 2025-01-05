import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    authorImage: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date().slice(0, 15),
    },
    slug: {
        type: String,
        default: function () {
            return this.title.replace(/\s+/g, '-').toLowerCase();
        }
    }
});

const blogModel = mongoose.models.blog || mongoose.model('blog', Schema);

export default blogModel;