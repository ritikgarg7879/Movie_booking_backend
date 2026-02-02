const showController = require('../controllers/show.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const showMiddlewares = require('../middlewares/show.middlewares');

const routes = (app) => {

    //CREATE
    app.post('/mba/api/v1/shows',authMiddlewares.isAuthenticated,authMiddlewares.isAdminOrClient,showMiddlewares.validateCreateShowRequest,showController.createShow);

    //READ
    app.get('/mba/api/v1/shows',showController.getShows);

    //DELETE
    app.delete('/mba/api/v1/shows/:id',authMiddlewares.isAuthenticated,authMiddlewares.isAdminOrClient,showController.deleteShow);

    //UPDATE
    app.patch('/mba/api/v1/shows/:id',authMiddlewares.isAuthenticated,authMiddlewares.isAdminOrClient,showMiddlewares.validateShowUpdateRequest,showController.updateShow);
}

module.exports = routes;