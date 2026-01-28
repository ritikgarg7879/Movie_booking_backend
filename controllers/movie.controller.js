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
        success:false,
        error:err,
        data:{},
        message:"Something went wrong"
      })
    }
}

//Controller function to delete movie
const deleteMovie=async(req,res)=>{
  try{
    const response=await Movie.deleteOne({
      _id:req.params.movieId
    });
    return res.status(201).json({
        success:true,
        error:{},
        message:"Successfully deleted the movie ",
        data:response
    });
  }catch(err){
      console.log(err);
      return res.status(500).json({
        success:false,
        error:err,
        data:{},
        message:"Something went wrong"
      })
    }
}



module.exports={createMovie,deleteMovie}