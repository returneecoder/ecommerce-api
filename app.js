const express = require('express')
const app = express()
require('dotenv').config()
require('express-async-errors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const connectDB = require('./db/connect')
// middleware(access to json data in req.body)
// middleware should be placed before routes

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter= require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes');


const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(morgan('tiny'))
app.use(express.json());

app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(cors());

// routes
app.get('/',(req,res)=>{
  //  console.log(req.cookies)
    res.send('ecom api')
})
app.get('/api/v1',(req,res)=>{
    console.log(req.signedCookies)
    res.send('ecommerce api')
})
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000
const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{
            console.log(`Server is running on ${port}`)
        })

    }
    catch(error){
        console.log(`Error: ${error}`)
    }
}

start();
