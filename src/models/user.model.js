const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new  mongoose.Schema({
    email:{
        type : String,
        require : [true , "Email is require for creating user"],
        trim : true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
        unique : [true , "Email already exists."]
    },
    name :{
        type:String,
        require : [true,"name is required for creating an account"] 
    },
    password:{
        type:String,
        // required: [true,"password is required for creating an account"],
        required: [true,"password is required for creating an account"],
        // minlength: [6,"password should contain 6 characters"]
        // select : false
    }
},{ 
        timeStamp:true
})


// userSchema.pre('save',async function(next){

//     if(!this.isModified("password")){
//         return 
//     }

//     try {
//         const salt = await bcrypt.genSalt();
//         const hashPassword = await bcrypt.hash(this.password,salt);
//         this.password = hashPassword;
//         console.log(this.password)
//         return
        
//     } catch (error) {
//         console.log("something want wrong while encrypting password : ", error)
//     }
// })
// })

// userSchema.methods.comparePassword = async function (candidatePassword) {
//     try{
//         const isMatch = await bcrypt.compare(candidatePassword, this.password);
//         console.log("IsMatch: ", isMatch);
//         return isMatch;
//     }catch(error){
//         console.log("Wrong username and password: "+error)
//     }
// }


const user = mongoose.model('user1',userSchema);

module.exports = user;

