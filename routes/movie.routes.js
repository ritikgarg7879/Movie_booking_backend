const MovieController=require('../controllers/movie.controller');
const MovieMiddlewares=require('../middlewares/movie.middlewares');
const authMiddleWares=require('../middlewares/auth.middlewares');


const routes=(app)=>{
  //routes function takes express app object as parameter

  //CREATE
  app.post('/mba/api/v1/movies',authMiddleWares.isAuthenticated,authMiddleWares.isAdminOrClient,MovieMiddlewares.validateMovieCreateRequest,MovieController.createMovie);
  
  //DELETE
  app.delete('/mba/api/v1/movies/:movieId',MovieController.deleteMovie);
  
  //READ
  app.get('/mba/api/v1/movies/:movieId',MovieController.getMovie);  

  //READ
  app.get('/mba/api/v1/movies',MovieController.getMovies); 
  
  //UPDATE
  app.put('/mba/api/v1/movies/:movieId',MovieController.updateMovie); 

  //UPDATE
  app.patch('/mba/api/v1/movies/:movieId',MovieController.updateMovie);   

}

module.exports=routes;