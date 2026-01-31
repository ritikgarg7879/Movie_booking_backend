const authController=require('../controllers/auth.controller')


const routes=(app)=>{

  //CREATE
  app.post('/mba/api/v1/auth/signup',authController.signup);
}


module.exports=routes;