const multer = require('multer');
const upload = require('./storage');
const CustomError = require('../../Service/errors');

const { deleteFiles, filesAssingBody, materialsAssingBody,reportsAssingBody} = require('./common');

const media = upload.fields([{ name: 'imagen', maxCount: 1 }]);

const checkFiles = (req, resp, next)=> { 
    media(req, resp, function(err) {
        const files = JSON.parse(JSON.stringify(req.files)); 
        const reqBody = JSON.parse(JSON.stringify(req.body));
        
        if (err) {
            deleteFiles(files); 
            if (err instanceof CustomError) {                
                return next(err);    
            }     
            if (err instanceof multer.MulterError) {
                return next(new CustomError({ code: err.code, field: err.field, error: err.message }, 400));           
            }
        } else {
            if (Object.keys(files).length <= 1) {   
               //(deleteFiles(files);
                req.body = filesAssingBody(files, reqBody); 
                return next();
            } else {
                req.body = filesAssingBody(files, reqBody);   
                return next();         
            }
        }
    });
};

const materials = upload.fields([{ name: 'material', maxCount: 1 }]);

const checkMaterials = (req, resp, next)=> { 
    materials(req, resp, function(err) {
        const files = JSON.parse(JSON.stringify(req.files)); 
        const reqBody = JSON.parse(JSON.stringify(req.body));
        if (err instanceof multer.MulterError) {
            return next(new CustomError({ code: err.code, field: err.field, error: err.message }, 400));           
        }
        req.body = materialsAssingBody(files, reqBody); 
        return next();
    });
};


const reports = upload.fields([{ name: 'report', maxCount: 1 }]);

const checkreports = (req, resp, next)=> { 
    reports(req, resp, function(err) {
        const files = JSON.parse(JSON.stringify(req.files)); 
        const reqBody = JSON.parse(JSON.stringify(req.body));
        if (err instanceof multer.MulterError) {
            return next(new CustomError({ code: err.code, field: err.field, error: err.message }, 400));           
        }
        req.body = reportsAssingBody(files, reqBody); 
        return next();
    });
};


module.exports = { checkFiles, checkMaterials ,checkreports};