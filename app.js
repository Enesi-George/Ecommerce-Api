const express = require ('express');
const app = express();
const bodyParser = require('body-parser');// to communicate with the backend framework of the api coming in.
const morgan = require('morgan'); //to log our http request for error handling
const mongoose = require('mongoose'); // the const is used before running the server
const cors = require('cors'); //this allow backend app ports to relate with frontend ports without forbidden error
require('dotenv/config');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');


app.use(cors());
app.options('*', cors());

//middleware
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


//Routes
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const ordersRouter = require('./routers/orders');
const usersRouter = require('./routers/users');

const api = process.env.API_URL;

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);


//Database
mongoose.connect(process.env.CONNECTION_STRING,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: 'eshop-database'
})
.then(()=>{
    console.log('Database Connection is ready...');
})
.catch((err)=>{
    console.log(err)
});

app.listen(3000, ()=>{
    console.log("server is running successfully on http://localhost:3000");
});