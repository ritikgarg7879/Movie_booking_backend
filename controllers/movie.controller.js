const Movie=require('../models/movie.model')


//Controller function to create new Movies 
const createMovie= async(req,res)=>{
  console.log("Created Properly");
    try{
      const movie= await Movie.create(req.body);
      return res.status(201).json({
        success:true,
        error:{},
        data:movie,
        message:"Successfully created a new movie",

      })
    }
    catch(err){
      console.log(err);
      return res.status(500).json({
        success:true,
        error:err,
        data:{},
        message:"Something went wrong"
      })
    }
}

module.exports={createMovie};