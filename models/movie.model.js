const mongoose=require('mongoose')
const {Schema}=mongoose;

//We can also write new mongoose.Schema()
const movieSchema=new Schema({
  name:{
    type:String,
    required:true,
    minLength:2
  },
  description:{
    type:String,
    required:true,
    minLength:5  //This line I added at the time of validation
  },
  casts:{
    type:[String],//there are more than one casts so we used it array
    required:true
  },
  trailerUrl:{
    type:String,
    required:true
  },
  language:{
    type:String,
    required:true,
    default:"English"
  },
  releaseDate:{
    type:String,
    required:true
  },
  director:{
    type:String,
    required:true
  },
  releaseStatus:{
    type:String,
    required:true,
    default:"RELEASED"
  }, 
},{timestamps:true});  //In this remember that whenver we create the document so it will give created and updated at

const Movie= mongoose.model('Movie',movieSchema);  //creates the new model
module.exports=Movie  //return the model

