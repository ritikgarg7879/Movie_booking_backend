const MovieController=require('../controllers/movie.controller');


const routes=(app)=>{
  //routes function takes express app object as parameter
  app.post('/mba/api/v1/movies',MovieController.createMovie);
  app.delete('/mba/api/v1/movies/:movieId',MovieController.deleteMovie);
}



module.exports=routes;