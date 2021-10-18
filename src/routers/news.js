const express = require('express');
const News = require('../models/news');
const auth = require('../middleware/authorization');
const router = express.Router();
const uploadImage = require('../tools/upload');

router.post('/news/add', auth, uploadImage.single('image'), async (req, res) => {
    try {
        const news = new News(req.body);
        news.reporter = req.reporter._id;
        if (req.file) news.image = req.file.buffer
        await news.save();
        res.status(200).send(news);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.post('/news/image/:id', uploadImage.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const news = await News.findById(id);
        if (!news)
            return res.status(400).send('News not found');
        if (!req.file)
            return res.status(400).send('No file was selected');
        news.image = req.file.buffer;
        await news.save();
        res.status(200).send('Upload complete');
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.get('/news', auth, async (req, res) => {
    try {
        await req.reporter.populate('news');
        const news = req.reporter.news;
        if (!news)
            res.status(400).send('No news found');
        res.status(200).send(news);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.get('/news/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const news = await News.findOne({ _id, reporter: req.reporter._id });
        if (!news)
            return res.status(400).send('News not found');
        res.status(200).send(news);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.patch('/news/:id', auth, async (req, res) => {
    const allowedUpdates = ['title', 'description'];
    const updates = Object.keys(req.body);
    const isValid = updates.every((element) => allowedUpdates.includes(element));
    if (!isValid)
        return res.status(400).send('you are only allowed to update ' + allowedUpdates)
    try {
        const _id = req.params.id;
        const news = await News.findOneAndUpdate({ _id, reporter: req.reporter._id }, req.body, {
            new: true,
            runValidators: true
        });
        if (!news)
            return res.status(400).send('News not found');
        res.status(200).send(news);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.delete('/news/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const news = await News.findOneAndDelete({ _id, reporter: req.reporter._id });
        if (!news)
            return res.status(400).send('News not found');
        res.status(200).send(news);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

module.exports = router;