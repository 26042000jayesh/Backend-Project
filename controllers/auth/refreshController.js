const Joi = require("joi");
const JwtService = require("../../services/JwtServices")
const CustomErrorHandler = require("../../services/CustomErrorHandler")
const {
    REFRESH_SECRET
} = require("../../config");
const RefreshToken = require("../../models/refreshToken");
const User = require("../../models/userModel");

const refreshController = {
    async refresh(req, res, next) {

        //payload validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });
        const {
            error
        } = refreshSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        let storedRefreshToken;
        try {
            storedRefreshToken = await RefreshToken.findOne({
                token: req.body.refresh_token
            });
            if (!storedRefreshToken) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            //might be refresh token got expired
            let userId;
            try {
                const {
                    _id
                } = JwtService.verify(storedRefreshToken.token, REFRESH_SECRET);
                userId = _id;
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const user = await User.findOne({
                _id: userId
            });
            if (!user) {
                return next(CustomErrorHandler.unAuthorized('No user found!'));
            }

            // tokens
            // Toekn
            const access_token = JwtService.sign({
                _id: user._id,
                role: user.role
            });
            const refresh_token = JwtService.sign({
                _id: user._id,
                role: user.role
            }, '1y', REFRESH_SECRET);
            await RefreshToken.create({
                token: refresh_token
            });
            res.json({
                access_token,
                refresh_token
            });

        } catch (err) {
            return next(new Error('Something went wrong ' + err.message));
        }
    }
}

module.exports = refreshController;