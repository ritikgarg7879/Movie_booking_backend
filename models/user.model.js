const mongoose=require('mongoose');
const {Schema}=mongoose;


const userSchema=new Schema({
    name:{
      type:String,
      required:true,
      unique:true
    },
    email:{
      type:String,
      required:true,
      unique:true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,'Please fill a valid email'],
      lowercase:true,
      trim:true
    },
    password:{
      type:String,
      required:true,
      minLength:6
    },
    userType:{
      type:String,
      required:true,
      default:"CUSTOMER"
    },
    userStatus:{
      type:String,
      required:true,
      default:"APPORVED"
    }

},{timestamps:true});

const User=mongoose.model('User',userSchema);
module.exports=User;