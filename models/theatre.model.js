const mongoose=require('mongoose')
const {Schema}=mongoose;

//We can also write new mongoose.Schema()
const theatreSchema=new Schema({
  name:{
    type:String,
    required:true,
    minLength:5
  },
  description:String,
  city:{
    type:String,
    required:true
  },
  pincode:{
    type:Number,
    required:true
  },
  address:String 
},{timestamps:true});  //In this remember that whenver we create the document so it will give created and updated at

const Theatre= mongoose.model('Theatre',theatreSchema);  //creates the new model
module.exports=Theatre  //return the model

