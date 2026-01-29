const theatreController=require('../controllers/theatre.controller');
const theatreMiddlewares=require('../middlewares/theatre.middleware');

const routes=(app)=>{
  app.post('/mba/api/v1/theatres',theatreMiddlewares.validateTheatreCreateRequest,theatreController.createTheatre);
}

module.exports=routes