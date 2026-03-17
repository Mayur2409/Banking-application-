require('dotenv').config()
const mongoose = require('mongoose')


function connectDB(){
    
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Server is connected to database")
    })
    .catch((error)=>{
        console.log("Server is not connected to db");
        process.exit(1)
    })

}

module.exports = connectDB