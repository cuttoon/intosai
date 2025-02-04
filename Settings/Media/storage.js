const path = require('path');
const multer = require('multer');
const CustomError = require('../../Service/errors');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname === 'imagen') {
            cb(null, './media/images');
        } else if (file.fieldname === 'programacion') {
            cb(null, './media/files');
        } else if (file.fieldname === 'material') {
            cb(null, './media/materials');
        } else if(file.fieldname === 'report' || file.fieldname === 'archivo'){
            cb(null,'./media/reports');
        }

    },
    filename: function(req, file, cb) {
        const extname = file.mimetype.split('/')[1];
        const name = file.originalname.slice(0, -(extname.length + 1));
        console.log('Saving file:', name, extname); // <-- Añadir esto
        cb(null, `${name.replace(/ /g, '_')}_${Date.now()}.${extname}`);
    }
});

const fileFilter = (req, file, cb) => {  
    const imageTypes = /jpeg|jpg|png|gif|pdf|zip/;
    const fileTypes = /pdf/;
    const materialTypes = /pdf|zip|rar/;
    const reportTypes = /jpeg|jpg|png|gif|pdf|zip|rar/;

    let extname;

    if (file.fieldname === 'imagen') {
        extname = imageTypes.test(path.extname(file.originalname).toLowerCase());                    
    } else if (file.fieldname === 'programacion') { 
        extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    } else if (file.fieldname === 'material') {
        extname = materialTypes.test(path.extname(file.originalname).toLowerCase());
    } else if (file.fieldname === 'report' || file.fieldname === 'archivo') {
        extname = reportTypes.test(path.extname(file.originalname).toLowerCase());
    }
    
    if (extname) {
        cb(null, true); 
    } else {
        const err = new CustomError({ code: 'INCORRECT_FILE_FORMAT', field: file.fieldname, error: 'INCORRECT FILE FORMAT' }, 400);
        cb(err);  
    }
};

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 20 }, fileFilter });

module.exports = upload;

