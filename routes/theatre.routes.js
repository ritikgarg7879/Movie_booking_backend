const theatreController=require('../controllers/theatre.controller');
const theatreMiddlewares=require('../middlewares/theatre.middleware');
const authMiddleWares=require('../middlewares/auth.middlewares')

const routes=(app)=>{
  //route function takes express app object as parameter

  //CREATE
  app.post('/mba/api/v1/theatres',theatreMiddlewares.validateTheatreCreateRequest,theatreController.createTheatre);

  //DELETE
  app.delete('/mba/api/v1/theatres/:theatreId',authMiddleWares.isAuthenticated,theatreController.deleteTheatre);

  //READ
  app.get('/mba/api/v1/theatres/:theatreId',theatreController.getTheatre);

  //READ
  app.get('/mba/api/v1/theatres',theatreController.getAllTheatre);

  //UPDATE
  app.put('/mba/api/v1/theatres/:theatreId',theatreController.updateTheatre);

  //UPDATE
  app.patch('/mba/api/v1/theatres/:theatreId',theatreController.updateTheatre);

  //UPDATE
  app.patch('/mba/api/v1/theatres/:id/movies',theatreMiddlewares.validateUpdateMoviesRequest,theatreController.updateMovies);

  //READ
  app.get('/mba/api/v1/theatres/:id/movies',theatreController.getMoviesInATheatre);

  //READ
  app.get('/mba/api/v1/theatres/:theatreId/movies/:movieId',theatreController.checkMovieInATheatre);


}

module.exports=routes