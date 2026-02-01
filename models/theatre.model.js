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
  address:String,

  //These is the feature to add array of movies in the theatre 
  movies:{
    type: [mongoose.Schema.Types.ObjectId],
    ref:'Movie'
  }


},{timestamps:true});  //In this remember that whenever we create the document so it will give created and updated at

const Theatre= mongoose.model('Theatre',theatreSchema);  //creates the new model
module.exports=Theatre  //return the model

