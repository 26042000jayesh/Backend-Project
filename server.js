const express =require("express");
const mongoose =require("mongoose");
const { APP_PORT, DB_LINK } = require("./config");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const routes = require("./allRoutes/routes");


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

app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));



