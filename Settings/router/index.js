const auth = require('./Autentica/SeguridadRoute');
const user = require('./User/UserRoute');
const common = require('./Common/CommonRoute')
const auditoria = require('./Auditoria/AuditoriaRoute')
const root = (app, next) => {
    const pkg = app.get('pkg');
    app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));
    app.all('*', (req, res, next) => {
        const error = new Error('La ruta que intentas acceder no existe.');
        error.statusCode = 404;
        next(error);
    });
    return next();
};

// eslint-disable-next-line consistent-return
const register = (app, routes, cb) => {
    if (!routes.length) {
        return cb();
    }

    routes[0](app, (err) => {
        if (err) {
            return cb(err);
        }
        return register(app, routes.slice(1), cb);
    });
};

module.exports = (app, next) => register(app, [
    auth, 
    user,
    common,  
    auditoria,
    root, 
], next);
