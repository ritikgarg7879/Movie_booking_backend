const authController=require('../controllers/auth.controller')
const authMiddleWares=require('../middlewares/auth.middlewares')

const routes=(app)=>{

  //CREATE
  app.post('/mba/api/v1/auth/signup',authMiddleWares.validateSignupRequest,authController.signup);
}



module.exports=routes;