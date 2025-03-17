const { parseJSON } = require("jquery");
const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");
const { createOds, deleteOds } = require("../clasification/ServicesOds");
const {
  deleteTag,
  createTag,
  getTag,
  newTag,
} = require("../clasification/ServicesTag");
const {
  deleteParticipante,
  createParticipante,
} = require("../participant/ServiceParticipant");
const moment = require("moment");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const parseOds = (data, report) => {
  return data.map((ele) => {
    ele.report_id = report;
    ele.ods_id = ele.ods_id ? parseInt(ele.ods_id) : ele.ods_id;
    //ele.organizacion_count = ele.organizacion_count ? parseInt(ele.organizacion_count) : ele.organizacion_count;
    //ele.pais_count = ele.pais_count ? parseInt(ele.pais_count) : ele.pais_count;
    return ele;
  });
};

const parseTag = (data, report) => {
  return data
    .filter((ele) => ele.nombre)
    .map((ele) => {
      console.log("ele", ele);
      return {
        report_id: report,
        nombre: ele.nombre,
      };
    });
};

const parseParticipante = (data, report) => {
  return data.flatMap((ele) => {
    const ambito_id = ele.ambito_id ? parseInt(ele.ambito_id) : null;
    const otro_id = ele.otro_id ? parseInt(ele.otro_id) : null;
    const rol_id = ele.rol_id ? parseInt(ele.rol_id) : null;
    const tipo_id = ele.tipo_id ? parseInt(ele.tipo_id) : null;

    if (Array.isArray(ele.pais_id)) {
      return ele.pais_id.map((pais) => ({
        report_id: report,
        ambito_id: ambito_id,
        entidad: ele.entidad || null,
        otro_id: otro_id,
        pais_id: !isNaN(parseInt(pais)) ? parseInt(pais) : null,
        rol_id: rol_id,
        tipo_id: tipo_id,
      }));
    } else {
      return {
        report_id: report,
        ambito_id: ambito_id,
        entidad: ele.entidad || null,
        otro_id: otro_id,
        pais_id: !isNaN(parseInt(ele.pais_id)) ? parseInt(ele.pais_id) : null,
        rol_id: rol_id,
        tipo_id: tipo_id,
      };
    }
  });
};

module.exports = {
  getallAuditoria: async () => {
    const data = { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } };
    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_AUDITORIA(:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getMore: async (data) => {
    data.cursor_a = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.cursor_o = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.cursor_p = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.cursor_i = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    const events = await db.procedureExecuteCursorsArray(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GET_DETALLE_AUDITORIA(:auditoria_id,:cursor_a,:cursor_o,:cursor_p,:cursor_i); END;`,
      data
    );
    return {
      auditoria: events.cursor_a,
      ods: events.cursor_o,
      participante: events.cursor_p,
      informe: events.cursor_i,
    };
  },
  getSimpleSearch: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GET_AUDITORIA_GENERAL(:buscar,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getAdvanceSearch: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GET_AUDITORIA_ADVANCE(:idiomas,:ambito,:pais,:inicio,:fin,:tipo,:categoria,:ods,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },

  getPolarGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_POLAR_GRAPH(:mes,:categoria,:ods,:tipo,:pais,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getDateGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_DATE_GRAPH(:ambito,:categoria,:ods,:tipo,:pais,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getCategoriesGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_CATEGORIES_GRAPH(:ambito,:mes,:ods,:tipo,:pais,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getOdsGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_ODS_GRAPH(:ambito,:mes,:categoria,:tipo,:pais,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getTypeReportGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_TYPE_REPORT_GRAPH(:ambito,:mes,:categoria,:ods,:pais,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getCountryGraph: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_COUNTRY_GRAPH(:ambito,:mes,:categoria,:tipo,:ods,:anio,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getauditlist: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_AUDIT_LIST(:usuario,:estado,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getlistreasons: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_LIST_OF_REASONS(:ids,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getlistusers: async (data) => {
    data.cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const cursor = await db.procedureExecuteCursor(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_LIST_USERS(:ids,:cursor); END;`,
      data
    );
    return cursor.cursor;
  },
  getTags: async () => {
    const tags_ = await getTag();
    const result = {
      tags: tags_,
    };
    return result;
  },
  newTags: async (data) => {
    const tags_ = await newTag(data);
    const result = {
      tags: tags_,
    };
    return result;
  },
  newobservation: async (data) => {
    var element = [];
    element.push({
      report_id: data.report_id,
      motivo: data.motivo,
    });

    const options = {
      autoCommit: true,
      batchErrors: true,
      bindDefs: {
        report_id: { type: oracledb.NUMBER },
        motivo: { type: oracledb.STRING, maxSize: 255 },
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
    };
    const observation = await db.manyExecute(
      `INSERT INTO SCAI_OBSERVACION(NOBS_REPORTID, COBS_MOTIVO)
         VALUES (:report_id,:motivo) RETURNING NOBS_ID INTO :ids `,
      element,
      options
    );

    return observation;
  },
  createParticipants: async (data) => {
    let _participante = await deleteParticipante(data.report_id);

    const parsedParticipantes = parseParticipante(
      data.participante,
      data.report_id
    );
    const participante_ = await createParticipante(parsedParticipantes);

    const result = {
      participante: participante_,
    };
    return result;
  },
  updatestatusaudit: async (data) => {
    //data.cursor_p = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.ids = {
      type: oracledb.NUMBER,
      dir: oracledb.BIND_INOUT,
      val: data.ids,
    };

    const events = await db.procedureExecute(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_UPDATE_STATUS(:ids,:status,:usuario); END;`,
      data
    );
    return events.ids;
  },
  getParticipants: async (data) => {
    data.cursor_p = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };

    const events = await db.procedureExecuteCursorsArray(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GET_PARTICIPANTES(:auditoria_id,:cursor_p); END;`,
      data
    );
    return { participante: events.cursor_p };
  },
  createClasification: async (data) => {
    // let _ods = await deleteOds(data.report_id);
    console.log("Recibido en createClasification:", data);
    const ods_ = await createOds(parseOds(data.ods, data.report_id));

    console.log("ODS creados:", ods_);
    //let _tag = await deleteTag(data.report_id);

    const tags = parseTag(data.tag, data.report_id);
    console.log("Tags parseados:", tags);
    const results = [];
    if (tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        console.log(`Procesando tag:`, tag);

        try {
          const tagIdArray = await newTag({ nombre: tag.nombre });
          const tagId = tagIdArray[0];
          console.log(`ID del nuevo tag '${tag.nombre}':`, tagId);

          const tagResult = await createTag(tagId, data.report_id);
          console.log("Resultado de createTag:", tagResult);

          results.push(tagResult);
        } catch (error) {
          console.error(`Error procesando el tag '${tag.nombre}':`, error);
          throw error;
        }
      }
    } else {
      console.log("No se recibieron tags válidos para procesar.");
    }
    return {
      ods: ods_,
      tags: results.length > 0 ? results : "No se crearon tags",
    };
  },
  getClasification: async (data) => {
    data.cursor_o = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    data.cursor_t = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    const events = await db.procedureExecuteCursorsArray(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GET_CLASIFICACIONES(:auditoria_id,:cursor_o,:cursor_t); END;`,
      data
    );
    return { ods: events.cursor_o, tag: events.cursor_t };
  },

  createInforme: async (data) => {
    try {
      console.log("data.ids", data.ids);
      data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
      data.informe = { val: data.informe ? parseInt(data.informe) : null };
      data.pais = { val: data.pais ? parseInt(data.pais) : null };
      console.log("data", data);
      const result = await db.procedureExecute(
        `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_REPORT(
              :publicacion,
              :idioma,
              :ids,
              :imagen,
              :informe,
              :pais,
              :report,
              :url
              ); END;`,
        data
      );

      console.log("Resultado de la inserción:", result);

      return result.ids;
    } catch (error) {
      console.error("Error durante la creación del informe:", error.message);
      throw new Error("Error al crear el informe en la base de datos.");
    }
  },

  createPractica: async (data) => {
    if (isNaN(data.ids))
      data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_INOUT };
    else
      data.ids = {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_INOUT,
        val: parseInt(data.ids),
      };

    const practica = await db.procedureExecute(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_PRACTICE(
        :argumento,
        :detalle,
        :estado,
        :ids,
        :nivel,
        :nombre,
        :reporte
        ); END;`,
      data
    );
    return practica.ids;
  },
  createAuditoria: async (data) => {
    data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
    data.imagen = { val: data.imagen ? parseInt(data.imagen) : null };
    const newEvent = await db.procedureExecute(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_AUDITORIA(
            :categoria,
            :ffin,
            :fini,
            :ids,
            :imagen,
            :objetivo,
            :resumen,
            :tipo,
            :titulo,
            :usuario            
            ); END;`,
      data
    );
    return newEvent.ids;
  },

  updateAuditoria: async (data) => {
    data.ids = {
      type: oracledb.NUMBER,
      dir: oracledb.BIND_INOUT,
      val: data.ids,
    };
    const newEvent = await db.procedureExecute(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_UPDATE_AUDITORIA(
            :categoria,
            :ffin,
            :fini,
            :ids,
            :objetivo,
            :resumen,
            :tipo,
            :titulo,
            :usuario            
            ); END;`,
      data
    );
    return newEvent.ids;
  },
  createReport: async (data) => {
    try {
      data.imagen = { val: data.imagen ? parseInt(data.imagen) : null };
      data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
      console.log("data antes de ejecutar procedimiento:", data);
      const newAudit = await db.procedureExecute(
        `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_AUDITORIA(
              :categoria,
              :ffin,
              :fini,
              :ids,
              :imagen,
              :objetivo,
              :resumen,
              :tipo,
              :titulo,
              :usuario            
              ); END;`,
        data
      );
      console.log("Resultado de la inserción:", newAudit);
      const auditoriaId = newAudit.ids;
      console.log("auditoriaId", auditoriaId);

      data.participanteId = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
      await db.procedureExecute(
        `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_PARTICIPANTE(
              :participanteId, 
              :auditoriaId, 
              :ambitId, 
              :paisId, 
              :entidad, 
              :otroId, 
              :rolId
        ); END;`,
        {
          participanteId: data.participanteId,
          auditoriaId: auditoriaId,
          ambitId: data.ambitId,
          paisId: data.paisId,
          entidad: data.entidad || null,
          otroId: data.otroId || null,
          rolId: data.rolId || null,
        }
      );

      const participanteId = data.participanteId;
      console.log("participanteId", participanteId);

      data.reportId = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
      data.informe = { val: data.informe ? parseInt(data.informe) : null };
      data.pais = { val: data.pais ? parseInt(data.pais) : null };

      await db.procedureExecute(
        `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_REPORT(
                    :publicacion,
                    :idioma,
                    :reportId,
                    :imagen,
                    :informe,
                    :pais,
                    :report,
                    :url
                    ); END;`,
        data
      );

      const reportId = data.reportId;

      console.log("reportId", reportId);

      if (data.odsList && data.odsList.length > 0) {
        await db.manyExecute(
          `INSERT INTO SCAI_AUDITORIA_ODS(naod_odsid, naod_reportid) 
           VALUES (:ods_id, :report_id)`,
          data.odsList.map((ods) => ({
            ods_id: ods.ods_id ? parseInt(ods.ods_id) : ods.ods_id,
            report_id: auditoriaId,
          }))
        );
      }

      return {
        message: "Informe creado",
        auditoriaId,
        participanteId,
        reportId,
      };
    } catch (error) {
      console.error("Error al crear auditoría:", error);
      throw new Error("No se pudo crear la auditoría");
    }
  },
  createReports: async (data) => {
    console.log("data antes de procesar:", data);

    const paisList = [].concat(data.paisid).filter(Boolean);
    const odsList = [].concat(data.odsid).filter(Boolean);

    let reportId = null;

    try {
      const initialData = {
        ...data,
        paisid: paisList[0],
        odsid: odsList[0],
        ids: { type: oracledb.NUMBER, dir: oracledb.BIND_INOUT },
      };

      console.log("Enviando datos al procedimiento:", initialData);
      const newReport = await db.procedureExecute(
        `BEGIN PG_SCAI_CONSULTA.pa_scai_create_informe(
                        :categoria,
                        :ffin,
                        :fini,
                        :ids,
                        :objetivo,
                        :resumen,
                        :tipo,
                        :titulo,
                        :usuario,
                        :publicacion,
                        :idioma,
                        :imagen,
                        :url,
                        :ambitoid,
                        :paisid,
                        :odsid
                    ); END;`,
        initialData
      );

      reportId = newReport.ids;
      console.log("Nuevo ID para auditoria:", reportId);

      const eliminate = paisList.slice(1);

      for (const paisId of eliminate) {
        await db.simpleExecute(
          `INSERT INTO SCAI_PARTICIPANTE (nnte_reportid, nnte_ambitoid, nnte_paisid) 
                 VALUES (:ids, :ambitoid, :paisid)`,
          { ids: reportId, ambitoid: data.ambitoid, paisid: paisId },
          { autoCommit: true }
        );
      }

      const duplicate = odsList.slice(1);

      for (const odsId of duplicate) {
        await db.simpleExecute(
          `INSERT INTO SCAI_AUDITORIA_ODS (naod_reportid, naod_odsid) 
                 VALUES (:ids, :odsid)`,
          { ids: reportId, odsid: odsId },
          { autoCommit: true }
        );
      }

      return reportId;
    } catch (error) {
      console.error("Error al ejecutar el procedimiento:", error);
      throw error;
    }
  },
};
