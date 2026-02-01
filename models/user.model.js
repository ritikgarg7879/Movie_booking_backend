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


/**
 * This is going to be an instance mehtod for the user to compare a password
 * with the stored encrypted password
 * @param plainPassword -> input password given by the user in sign in request
 * @returns -> boolean denoting whether password are same or not
 */

userSchema.methods.isValidPassword=async function(plainPassword){
  const currentUser=this;
  const compare= await bcrypt.compare(plainPassword,currentUser.password);
  return compare;
}

const User=mongoose.model('User',userSchema);
module.exports=User;