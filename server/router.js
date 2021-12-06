const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getChirps', mid.requiresLogin, controllers.Chirp.getChirps);
  app.get('/getYours', mid.requiresLogin, controllers.Chirp.getChirps);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Chirp.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Chirp.make);
  app.post('/search', mid.requiresLogin, controllers.Chirp.search);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, controllers.Account.notFound);
};

module.exports = router;
