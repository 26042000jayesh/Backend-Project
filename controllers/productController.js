const Product = require("../models/product")
const multer = require("multer");
const Joi = require("joi");
const path = require("path");
const fs = require("fs");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const productModel = require("../models/product");

//storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
    }
});

const handleMultipartData = multer({
    storage,
    limits: {
        fileSize: 1000000 * 5
    }
}).single('image');

const productController = {
    async store(req, res, next) {
        // Multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            // validation
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
                image: Joi.string(),
            });
            const {
                error
            } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });

                return next(error);
            }

            const {
                name,
                price,
                size
            } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath,
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },


    async update(req, res, next) {
        // TODO : delete the old uploaded image file if image is also updated
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }
            // validation
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
                image: Joi.string()
            });
            const {
                error
            } = productSchema.validate(req.body);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
            }

            const {
                name,
                price,
                size
            } = req.body;
            let document;
            try {
                document = await Product.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    name,
                    price,
                    size,
                    ...(req.file && {
                        image: filePath
                    }),
                }, {
                    new: true
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },

    async destroy(req, res, next) {
        const document = await productModel.findByIdAndDelete(req.params.id);
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        //delete uploaded image
        const imagePath = document.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
        });
        res.json(document);  
    },

    async index(req,res,next){
        let documents;
        try {
            documents=await productModel.find().select('-__v -_id -updatedAt');
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
        res.json(documents);
    },

    async show(req,res,next){
        let document;
        try {
            document=await productModel.findById(req.params.id).select('-__v -_id -updatedAt');
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
        res.json(document);
    }
}

module.exports = productController;