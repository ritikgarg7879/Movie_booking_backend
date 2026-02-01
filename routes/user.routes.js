const userController = require('../controllers/user.controller');
const userMiddleware=require('../middlewares/user.middlewares');
const authMiddleWare=require('../middlewares/auth.middlewares');


const route = (app) => {

  //UPDATE
    app.patch(
        '/mba/api/v1/user/:id',
        authMiddleWare.isAuthenticated,
        userMiddleware.validateUpdateUserRequest,
        authMiddleWare.isAdmin,
        userController.update
    )
}

module.exports = route;