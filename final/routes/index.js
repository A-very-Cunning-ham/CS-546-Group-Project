const userRoutes = require('./users');
const eventRoutes = require('./events');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/event', eventRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;