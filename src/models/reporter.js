const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        minlength: 9,
        validate(value) {
            if (value < 0)
                throw new Error('Age cannot be negative');
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('email is invalid');
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    avatar: {
        type: Buffer,
    },
});

schema.virtual('news', {
    ref: "News",
    localField: '_id',
    foreignField: 'reporter',
});

schema.pre('save', async function (next) {
    const reporter = this;
    if (reporter.isModified('password'))
        reporter.password = await bcrypt.hash(reporter.password, 8);
    next();
});

schema.methods.generateToken = async function(){
    const reporter = this;
    const _id = reporter._id.toString();
    const token = jwt.sign({_id}, 'security');
    reporter.tokens = reporter.tokens.concat({token});
    await reporter.save();
    return token;
}

schema.statics.findByCredentials = async function(email, password){
    const reporter = await Reporter.findOne({email});
    if(!reporter)
        throw new Error('Please check email or password');
    const isValid = await bcrypt.compare(password, reporter.password);
    if(!isValid)
        throw new Error('Please check email or password');
    return reporter;
}

const Reporter = mongoose.model('Reporter', schema);
module.exports = Reporter;