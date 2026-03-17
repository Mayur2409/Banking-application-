
const app = require('./src/app.js')
const dotenv = require('dotenv');
const connectDB = require('./src/config/db')
dotenv.config()

connectDB()

app.listen(process.env.PORT,()=>{
    console.log(`server is started on port ${process.env.PORT}`)
})