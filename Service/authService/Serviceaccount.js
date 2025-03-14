const oracledb = require("oracledb");
const db = require("../../Settings/Database/database");

const getUserById = async (userId) => {
    const result = await db.procedureExecuteCursor(
        `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt, :cursor); END;`,
        {
            sql_stmt: `SELECT * FROM SCAI_USUARIOS WHERE NUSU_ID = ${userId}`,
            cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        }
    );

    if (!result.cursor) {
        throw new Error("Cursor no encontrado en el resultado");
    }

    return result.cursor.length ? result.cursor[0] : null;
};


const getUserbyEmail = async (email) => {
  const user = await db.procedureExecuteCursor(
    `BEGIN PG_SCAI_CONSULTA.PA_SCAI_GENERIC_SELECT_EXECUTE(:sql_stmt,:cursor); END;`,
    {
      sql_stmt: `SELECT NUSU_ID,CUSU_EMAIL,CUSU_PASSWORD,NUSU_ISACTIVE,NUSU_ISSUPERADMIN,NUSU_ISSTAFF,NUSU_ROLID, CUSU_FIRSTNAME AS NOMBRE FROM SCAI_USUARIOS WHERE CUSU_EMAIL='${email}'`,
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    }
  );
  return user.cursor[0];
};

module.exports = {
  getUserById,
  getUserbyEmail,
};
