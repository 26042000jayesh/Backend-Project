const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const {
    APP_PORT,
    DB_LINK
} = require("./config");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./allRoutes/routes");
const app = express();


// Database connection
mongoose.connect(DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

// the "use" method is a powerful middleware function that allows you to add middleware to the request handling chain. 
// the sequence of using the use method does matter in Express. The middleware functions are executed in the order they are defined, so the sequence determines how the request and response objects are processed.
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({
    extended: false
}));
// express.json() is a built-in middleware function provided by the Express.js framework. It is used to parse incoming requests with JSON payloads. When this middleware is mounted using app.use(express.json()), it instructs Express to parse the incoming request body if it's in JSON format and populate the req.body property with the parsed data. This makes it easier to work with JSON data sent by clients in your application.
app.use(express.json());
app.get('/', (req, res) => {
    res.json("Hello, world!");
})
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));