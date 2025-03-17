const db = require("../../Settings/Database/database");
const oracledb = require("oracledb");

const createReport = async (data) => {
  try {
    console.log("data", data)
    // data.imagen = { val: data.imagen ? parseInt(data.imagen) : null };
    data.ids = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };

    const newAudit = await db.procedureExecute(
      `BEGIN PG_SCAI_CONSULTA.PA_SCAI_INSERT_AUDITORIA(
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
    console.log("participanteId", participanteId)

    data.reportId = { type: oracledb.NUMBER, dir: oracledb.BIND_OUT };
    data.informe = {val: data.informe ? parseInt(data.informe) : null};
    data.pais = {val: data.pais ? parseInt(data.pais) : null};
    
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

    console.log("reportId", reportId)

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
};

module.exports = { createReport };