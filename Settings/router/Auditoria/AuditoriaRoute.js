const express = require('express');
const router = express.Router();
const { Auditoria } = require('../../../Controllers');
const  { Filter  } = require('../../Server/midlewar/permissions');
const { checkFiles, checkMaterials,checkreports } = require('../../Media/media');
router.post('/Auditoria',Filter,checkFiles, Auditoria.createauditoria);
router.get('/getAllAuditoria',Filter, Auditoria.getallauditoria);

// router.get('/getSimpleSearch',Filter, Auditoria.getSimpleSearch);
router.post('/creationReports',Filter,checkFiles, Auditoria.creationReports);
// router.get('/getAdvanceSearch',Filter, Auditoria.getAdvanceSearch);

router.post('/getSimpleSearch', Auditoria.getSimpleSearch);

router.post('/getAdvanceSearch', Auditoria.getAdvanceSearch);

router.post('/getPolarGraph', Auditoria.getPolarGraph);

router.post('/getDateGraph', Auditoria.getDateGraph);

router.post('/getCategoriesGraph', Auditoria.getCategoriesGraph);

router.post('/getOdsGraph', Auditoria.getOdsGraph);

router.post('/getTypeReportGraph', Auditoria.getTypeReportGraph);

router.post('/getCountryGraph', Auditoria.getCountryGraph);

router.post('/getauditlist',Filter, Auditoria.getauditlist);

router.post('/getlistreasons',Filter, Auditoria.getlistreasons);

router.post('/getMore', Auditoria.getMore);

router.get('/getTag', Auditoria.getTag);

router.post('/tag',Filter, Auditoria.newTag);

router.post('/observation',Filter, Auditoria.newobservacion);

router.post('/getlistuser',Filter, Auditoria.getlistusers);

router.post('/statusauditoria', Filter, Auditoria.updatestatusaudit);

//router.get('/getAllAuditoria',Filter, Auditoria.getallauditoria);
router.get('/:aid/clasification', Filter, Auditoria.getClasification);

router.get('/:aid/participant', Filter, Auditoria.getParticipants);

router.post('/clasification', Filter, Auditoria.createClasification);

router.post('/participant', Filter, Auditoria.createParticipants);

router.post('/report', Filter,checkFiles, Auditoria.createInforme);

router.post('/practice', Filter, Auditoria.createPractica);

module.exports = (app, nextMain) => {
    app.use('/intosai/auditoria', router);
    return nextMain();
};
