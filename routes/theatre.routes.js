const theatreController=require('../controllers/theatre.controller');
const theatreMiddlewares=require('../middlewares/theatre.middleware');

const routes=(app)=>{
  app.post('/mba/api/v1/theatres',theatreMiddlewares.validateTheatreCreateRequest,theatreController.createTheatre);
  app.delete('/mba/api/v1/theatres/:theatreId',theatreController.deleteTheatre);
  app.get('/mba/api/v1/theatres/:theatreId',theatreController.getTheatre);
}

module.exports=routes