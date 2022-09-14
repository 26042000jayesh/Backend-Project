const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: false
});

const refreshTokenModel = mongoose.model('refreshTokenModel', refreshTokenSchema, 'refreshTokens');

module.exports = refreshTokenModel;