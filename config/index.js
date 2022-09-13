const dotenv = require("dotenv");
dotenv.config();

module.exports= {
    APP_PORT,
    DB_LINK,
    JWT_SECRET,
    REFRESH_SECRET
} = process.env;

