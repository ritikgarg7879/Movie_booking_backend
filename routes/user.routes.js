const userController = require('../controllers/user.controller');


const route = (app) => {

  //UPDATE
    app.patch(
        '/mba/api/v1/user/:id',
        userController.update
    )
}

module.exports = route;