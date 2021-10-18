const jwt = require('jsonwebtoken');
const Reporter = require('../models/reporter');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'security');
        const _id = decode._id;
        const reporter = await Reporter.findOne({ _id, 'tokens.token': token });
        if (!reporter)
            throw new Error('You are not Authorized to access');
        req.token = token;
        req.reporter = reporter;
        next();
    } catch (error) {
        res.status(500).send('' + error);
    };
}

module.exports = auth;