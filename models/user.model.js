const mongoose=require('mongoose');
const {Schema}=mongoose;
const bcrypt=require('bcrypt');
const {USER_ROLE,USER_STATUS}=require('../utils/constants');


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
      match: [
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Please fill a valid email'
      ],
      lowercase:true,
      trim:true
    },
    password:{
      type:String,
      required:true,
      minLength:6
    },
    userRole:{
      type:String,
      required:true,
      enum:{
        values:[USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.client],
        message:"Invalid user role given"
      },
      default:USER_ROLE.customer
    },
    userStatus:{
      type:String,
      required:true,
      enum:{
        values:[USER_STATUS.approved, USER_STATUS.pending, USER_STATUS.rejected],
        message:"Invalid status for user given"
      },
      default:USER_STATUS.approved
    }

},{timestamps:true});



//In this before new user is made we are encrypting the password
userSchema.pre('save',async function (next){
  //a trigger to encrypt plain password before saving the user

  if (!this.isModified('password')) {
    return ;
  }


  // // console.log(this)
  // const hash=await bcrypt.hash(this.password,10);
  // // console.log(hash);
  // this.password=hash;
  // // console.log(this);
  // next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

});

const User=mongoose.model('User',userSchema);
module.exports=User;