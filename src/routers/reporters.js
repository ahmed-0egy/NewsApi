const express = require('express');
const Reporter = require('../models/reporter');
const auth = require('../middleware/authorization');
const router = express.Router();
const uploadImage = require('../tools/upload');

router.post('/signup', uploadImage.single('avatar'), async (req, res) => {
    const data = req.body;
    try {
        const reporter = new Reporter(data);
        const token = await reporter.generateToken();
        if (req.file) reporter.avatar = req.file.buffer;
        await reporter.save();
        res.status(200).send({ reporter, token });
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.post('/login', async (req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password);
        const token = await reporter.generateToken();
        res.status(200).send({ reporter, token });
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.post('/profile/avatar', auth, uploadImage.single('avatar'), async (req, res) => {
    try {
        req.reporter.avatar = req.file.buffer;
        await req.reporter.save();
        res.status(200).send('Uploaded');
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.get('/profile', auth, async (req, res) => {
    const reporter = req.reporter;
    res.status(200).send(reporter);
});

router.get('/profile/mynews', auth, async(req, res) => {
    try {
        await req.reporter.populate('news');
        res.status(200).send(req.reporter.news);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.get('/reporters', auth, async (req, res) => {
    try {
        const reporters = await Reporter.find({});
        if (!reporters)
            res.status(400).send('No reporters found');
        res.status(200).send(reporters);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.get('/reporters/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const reporter = await Reporter.findById(id);
        if (!reporter)
            return res.status(400).send('Reporter not found');
        res.status(200).send(reporter);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.patch('/reporters/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'phone'];
    const isValid = updates.every((element) => allowedUpdates.includes(element));
    if (!isValid)
        return res.status(500).send('you are only allowed to update ' + allowedUpdates);
    try {
        const id = req.params.id;
        const reporter = await Reporter.findById(id);
        if (!reporter)
            return res.status(400).send('Reporter not found');
        updates.forEach((element) => reporter[element] = req.body[element]);
        await reporter.save();
        res.status(200).send(reporter);
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.delete('/reporters/cleandb', auth, async (req, res) => {
    try {
        await Reporter.deleteMany({});
        res.status(200).send('All reporters was deleted successfully');
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.delete('/reporters/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const reporter = await Reporter.findByIdAndDelete(id);
        if (!reporter)
            return res.status(400).send('Reporter not found');
        res.status(200).send('Reporter was deleted successfully');
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.delete('/logout', auth, async (req, res) => {
    try {
        const reporter = req.reporter;
        reporter.tokens = reporter.tokens.filter((element) => element.token != req.token);
        await reporter.save();
        res.status(200).send('Logged out Successfully');
    } catch (error) {
        res.status(500).send('' + error);
    };
});

router.delete('/logoutall', auth, async (req, res) => {
    try {
        const reporter = req.reporter;
        reporter.tokens = [];
        await reporter.save();
        res.status(200).send('Logged out Successfully from all devices');
    } catch (error) {
        res.status(500).send('' + error);
    };
});

module.exports = router;