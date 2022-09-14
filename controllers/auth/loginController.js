const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel")
const JwtService = require("../../services/JwtServices")
const CustomErrorHandler = require("../../services/CustomErrorHandler")
const {
    REFRESH_SECRET
} = require("../../config");
const RefreshTokenModel = require("../../models/refreshToken");

// shorter syntax for methods in an object literal:
const loginController = {
    async login(req, res, next) {
        // Validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        const {
            error
        } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // Toekn
            const access_token = JwtService.sign({
                _id: user._id,
                role: user.role
            });
            refresh_token = JwtService.sign({
                _id: user._id,
                role: user.role
            }, '1y', REFRESH_SECRET);
            //save refresh token on server
            await RefreshTokenModel.create({
                token: refresh_token
            });
            res.json({
                access_token,
                refresh_token
            });

        } catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const {
            error
        } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        
        try {
            await RefreshTokenModel.deleteOne({
                token: req.body.refresh_token
            });
        } catch (error) {
            return next(new Error('Something went wrong in DB'));
        }
        res.json({
            message: "User Logged Out Successfully"
        });
    }

};


module.exports = loginController;