const mongoose=require('mongoose');
const {Schema}=mongoose;
const bcrypt=require('bcrypt')


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