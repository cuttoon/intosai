const httpErrors = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'La ruta que intentas acceder no existe',
    500: 'Internal server error',
};
  

const isKnownHTTPErrorStatus = (num) => {
    return typeof num === 'number' && Object.keys(httpErrors).indexOf(`${num}`) >= 0;
};
   

module.exports = (err, req, res, next) => {
    const statusCode = isKnownHTTPErrorStatus(err.statusCode) ? err.statusCode : 500;
    const message = err.message || httpErrors[statusCode] || 'Error desconocido';

    console.log(statusCode, message)

 
    if (statusCode === 500) {
        console.error(statusCode, message);
    }  
    res.status(statusCode).json({ statusCode, message });
    next();
};