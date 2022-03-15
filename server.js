const express = require ('express');
const path = require ('path');
const app = express();
const handle = require('express-handlebars');
const bodyParser = require ('body-parser');
const cookieParser = require('cookie-parser');


app.engine('.hbs', handle.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use("/public", express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.json());
app.use(cookieParser());

const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });
connectDB();

app.use('/', require('./routes/get'));
app.use('/', require('./routes/post'));

app.listen(2000, () => { 
    console.log('Server starting at port: ', 2000)
});