//for validation
const Joi = require("joi");
//for encrypting
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const JwtService = require("../../services/JwtServices")
const CustomErrorHandler = require("../../services/CustomErrorHandler")
const {
    REFRESH_SECRET
} = require("../../config");
const RefreshTokenModel = require("../../models/refreshToken");

// shorter syntax for methods in an object literal:
const registerController = {
    async register(req, res, next) {

        // Validation for payload
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });
        const {
            error
        } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        // check if user is in the database already 
        try {
            const exist = await User.exists({
                email: req.body.email
            });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        } catch (err) {
            return next(err);
        }
        const {
            name,
            email,
            password
        } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare the document
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token;
        let refresh_token;

        try {
            const result = await user.save();
            console.log(result);

            // Tokens
            access_token = JwtService.sign({
                _id: result._id,
                role: result.role
            });
            refresh_token = JwtService.sign({
                _id: result._id,
                role: result.role
            }, '1y', REFRESH_SECRET);
            //save refresh token on server
            await RefreshTokenModel.create({
                token: refresh_token
            });

        } catch (err) {
            return next(err);
        }
        return res.json({
            access_token,
            refresh_token
        });
    }
}


module.exports = registerController;