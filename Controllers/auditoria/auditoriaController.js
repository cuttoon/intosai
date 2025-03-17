const userdb = require("../../Service/auditoria/ServiceAuditoria");
//const { validateUser } = require('../../Models');
const CustomError = require("../../Service/errors");
const { deleteFiles } = require("../../Settings/Media/common");
const moment = require("moment");
const { validateAuditoria } = require("../../Models");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = {
  getallauditoria: async (req, resp, next) => {
    try {
      const temas = await userdb.getallAuditoria();
      resp.send({ result: temas });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getSimpleSearch: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getSimpleSearch(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getAdvanceSearch: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getAdvanceSearch(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getPolarGraph: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getPolarGraph(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },

  getDateGraph: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getDateGraph(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getCategoriesGraph: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getCategoriesGraph(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getOdsGraph: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getOdsGraph(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getTypeReportGraph: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getTypeReportGraph(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getCountryGraph: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getCountryGraph(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },

  getauditlist: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getauditlist(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },

  getlistreasons: async (req, resp, next) => {
    try {
      const motivo = await userdb.getlistreasons(req.body);
      resp.send({ result: motivo });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },

  getMore: async (req, resp, next) => {
    try {
      const auditoria = await userdb.getMore(req.body);
      resp.send({ result: auditoria });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getlistusers: async (req, resp, next) => {
    try {
      const tags = await userdb.getlistusers(req.body);
      resp.send({ result: tags });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getTag: async (req, resp, next) => {
    try {
      const tags = await userdb.getTags();
      resp.send({ result: tags });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  newTag: async (req, resp, next) => {
    try {
      const tags = await userdb.newTags(req.body);
      resp.send({ result: tags });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  newobservacion: async (req, resp, next) => {
    try {
      const tags = await userdb.newobservation(req.body);
      resp.send({ result: tags });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  updatestatusaudit: async (req, resp, next) => {
    try {
      const _ids = req.body.ids;
      const _status = req.body.status;
      const _usuario = req.body.usuario;

      const auditorias = await userdb.updatestatusaudit({
        ids: _ids,
        status: _status,
        usuario: _usuario,
      });
      resp.send({ result: auditorias });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getClasification: async (req, resp, next) => {
    try {
      const { aid } = req.params;
      const participants = await userdb.getParticipants({ auditoria_id: aid });
      resp.send({ result: participants });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createClasification: async (req, resp, next) => {
    try {
      //validateParticipants(req.body);
      const participants = await userdb.createClasification(req.body);
      resp.send({ result: participants });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      console.log(err);
      return resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getParticipants: async (req, resp, next) => {
    try {
      const { aid } = req.params;
      const participants = await userdb.getParticipants({ auditoria_id: aid });
      resp.send({ result: participants });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createParticipants: async (req, resp, next) => {
    try {
      //validateParticipants(req.body);
      const participants = await userdb.createParticipants(req.body);
      resp.send({ result: participants });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      console.log(err);
      return resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  getInforme: async (req, resp, next) => {
    try {
      const { aid } = req.params;
      const informe = await userdb.getinforme({ auditoria_id: aid });
      resp.send({ result: informe });
    } catch (err) {
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createInforme: async (req, resp, next) => {
    try {
      //validateParticipants(req.body);
      console.log("req.files.imagen", req.files.imagen);
      if (req.files.imagen == undefined) {
        //deleteFiles(req.files);
        return next(400);
      }

      console.log(
        "req.body.publicacion",
        moment(req.body.publicacion, "DD-MM-YYYY", true)
      );
      req.body.publicacion = moment(
        req.body.publicacion,
        "DD-MM-YYYY",
        true
      ).toDate();

      console.log("req.body.publicacion", req.body.publicacion);
      /* const dataEvent = Object.assign({}, req.body);
      console.log("dataEvent", dataEvent) */

      const informe = await userdb.createInforme(req.body);
      resp.send({ result: informe });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      console.error("Error en el controlador:", err);
      return resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createPractica: async (req, resp, next) => {
    try {
      //validateParticipants(req.body);
      const practica = await userdb.createPractica(req.body);
      resp.send({ result: practica });
    } catch (err) {
      if (err instanceof CustomError) {
        return next(err);
      }
      console.log(err);
      return resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createauditoria: async (req, resp, next) => {
    try {
      console.log("recibiendo datos: ", req.body);

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);

      req.body.categoria = parseInt(req.body.categoria);
      req.body.tipo = parseInt(req.body.tipo);

      // req.body.fini = moment(req.body.fini).toDate();
      req.body.fini = moment(req.body.fini, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.fini, "DD-MM-YYYY").toDate()
        : null;
      req.body.ffin = moment(req.body.ffin, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.ffin, "DD-MM-YYYY").toDate()
        : null;
      // req.body.ffin =moment(req.body.ffin).toDate();

      if (!req.body.fini || !req.body.ffin) {
        console.log("Fechas invalidas");
        return resp.status(400).send({
          statusCode: 400,
          message: "Fecha inválida, por favor use el formato DD-MM-YYYY.",
        });
      }
      req.body.usuario = req.body.usuario;

      validateAuditoria(req.body);

      const dataEvent = Object.assign({}, req.body);
      console.log("dataEvent", dataEvent);
      let result = null;
      if (req.body.ids == 0) {
        result = await userdb.createAuditoria(dataEvent);
      } else {
        result = await userdb.updateAuditoria(dataEvent);
      }

      resp.send({ result });
    } catch (err) {
      console.log("Error al crear la auditoria", err.message);
      if (err instanceof CustomError) {
        return next(err);
      }
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
  createReport: async (req, resp, next) => {
    try {
      console.log("recibiendo datos: ", req.body);

      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);
      req.body.categoria = parseInt(req.body.categoria);
      req.body.tipo = parseInt(req.body.tipo);

      req.body.fini = moment(req.body.fini, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.fini, "DD-MM-YYYY").toDate()
        : null;
      req.body.ffin = moment(req.body.ffin, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.ffin, "DD-MM-YYYY").toDate()
        : null;

      if (!req.body.fini || !req.body.ffin) {
        console.log("Fechas invalidas");
        return resp.status(400).send({
          statusCode: 400,
          message: "Fecha inválida, por favor use el formato DD-MM-YYYY.",
        });
      }
      req.body.usuario = req.body.usuario;
      validateAuditoria(req.body);

      // validaciones del informe
      if (req.files && req.files.imagen == undefined) {
        return next(400);
      }
      req.body.publicacion = moment(
        req.body.publicacion,
        "DD-MM-YYYY",
        true
      ).toDate();
      // req.body.imagen = { val: req.body.imagen ? parseInt(req.body.imagen) : null };
      // const auditoriaResult = await createReport(req.body);
      // console.log("auditoriaResult", auditoriaResult)
      // const auditoriaId = auditoriaResult.auditoriaId;
      // console.log("auditoriaId", auditoriaId);

      console.log("req.files.imagen", req.files.imagen);
      // req.body.imagen = req.body.imagen;

      const dataEvent = Object.assign({}, req.body);
      console.log("dataEvent", dataEvent);
      let result = null;
      if (req.body.ids == 0) {
        result = await userdb.createReport(dataEvent);
      }

      resp.send({ result });
    } catch (error) {
      console.log("Error al crear la auditoria", error.message);
      if (error instanceof CustomError) {
        return next(error);
      }
      resp.status(500).send({ statusCode: 500, message: error.message });
    }
  },
  creationReports: async (req, resp, next) => {
    try {
      console.log("recibiendo datos: ", req.body);
      req.body.ids =
        req.body.ids == undefined || parseInt(req.body.ids) == 0
          ? 0
          : parseInt(req.body.ids);
      req.body.categoria = parseInt(req.body.categoria);
      req.body.tipo = parseInt(req.body.tipo);
      req.body.usuario = parseInt(req.body.usuario);
      req.body.idioma = parseInt(req.body.idioma);
      req.body.ambitoid = parseInt(req.body.ambitoid);

      req.body.fini = moment(req.body.fini, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.fini, "DD-MM-YYYY").toDate()
        : null;
      req.body.ffin = moment(req.body.ffin, "DD-MM-YYYY", true).isValid()
        ? moment(req.body.ffin, "DD-MM-YYYY").toDate()
        : null;
      req.body.publicacion = moment(
        req.body.publicacion,
        "DD-MM-YYYY",
        true
      ).isValid()
        ? moment(req.body.publicacion, "DD-MM-YYYY").toDate()
        : null;

      if (!req.body.fini || !req.body.ffin || !req.body.publicacion) {
        console.log("Fechas invalidas");
        return resp.status(400).send({
          statusCode: 400,
          message: "Fecha inválida, por favor use el formato DD-MM-YYYY.",
        });
      }

      // req.body.paisid = Array.isArray(req.body.paisid) ? req.body.paisid.map(Number) : [parseInt(req.body.paisid)];
      // req.body.odsid = req.body.odsid ? req.body.odsid.map(Number) : [];
      // validateAuditoria(req.body);

      // Eliminar duplicados antes de enviar al servicio
      req.body.paisid = [...new Set([].concat(req.body.paisid).map(Number).filter(Boolean))];
      req.body.odsid = [...new Set([].concat(req.body.odsid).map(Number).filter(Boolean))];

          

      const dataEvent = Object.assign({}, req.body);
      console.log("Datos antes de enviar:", req.body);
      console.log("dataEvent", dataEvent);

      const result = await userdb.createReports(dataEvent);
      console.log("ID generado:", result);
      resp.send({ result });
    } catch (err) {
      console.log("Error al crear el informe", err.message);
      if (err instanceof CustomError) {
        return next(err);
      }
      resp.status(500).send({ statusCode: 500, message: err.message });
    }
  },
};
