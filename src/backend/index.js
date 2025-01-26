import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sql, poolPromise } from "./db.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

//ruta para insertar datos pacientes
app.post("/api/pacientes", async (req, res) => {
  try {
    const {
      nombrePaciente,
      identidadPaciente,
      fechaNacimiento,
      sexo,
      estadoCivil,
      lugarProcedencia,
    } = req.body;
    const pool = await poolPromise;

    // Insertar datos
    await pool
      .request()
      .input("nombrePaciente", sql.VarChar, nombrePaciente)
      .input("identidadPaciente", sql.VarChar, identidadPaciente)
      .input("fechaNacimiento", sql.Date, fechaNacimiento)
      .input("sexo", sql.VarChar, sexo)
      .input("estadoCivil", sql.VarChar, estadoCivil)
      .input("lugarProcedencia", sql.VarChar, lugarProcedencia)
      .query(
        "INSERT INTO Pacientes (nombrePaciente, identidadPaciente, fechaNacimiento, sexo, estadoCivil, lugarProcedencia) VALUES (@nombrePaciente, @identidadPaciente, @fechaNacimiento, @sexo, @estadoCivil, @lugarProcedencia)"
      );

    res.status(200).send("Datos insertados correctamente");
  } catch (error) {
    console.error("Error al insertar datos:", error);
    res.status(500).send("Error al insertar datos");
  }
});

/* //query para buscar pacientes pon numero de identidad
app.get("/api/pacientes/:identidadPaciente", async (req, res) => {
  try {
    const { identidadPaciente } = req.params;
    console.log("Valor recibido:", identidadPaciente);

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("identidadPaciente", sql.VarChar, identidadPaciente)
      .query(
        `SELECT 
               idPaciente, 
               nombrePaciente, 
               fechaNacimiento, 
               DATEDIFF(YEAR, fechaNacimiento, GETDATE()) -
               CASE 
                 WHEN MONTH(fechaNacimiento) > MONTH(GETDATE()) OR 
                      (MONTH(fechaNacimiento) = MONTH(GETDATE()) AND DAY(fechaNacimiento) > DAY(GETDATE()))
                 THEN 1 
                 ELSE 0 
               END AS edad
             FROM Pacientes 
             WHERE identidadPaciente = @identidadPaciente`
      );

    console.log("Resultado de la consulta:", result.recordset);

    if (result.recordset.length === 0) {
      console.log("Paciente no encontrado");
      return res.status(404).send("paciente no encontrado");
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error al buscar el paciente:", error);
    res.status(500).send("error al buscar el paciente");
  }
}); */

// Query para buscar pacientes por nombre devuelve solo 1
app.get("/api/pacientes/:nombrePaciente", async (req, res) => {
  try {
    const { nombrePaciente } = req.params;
    console.log("Valor recibido:", nombrePaciente);

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("nombrePaciente", sql.VarChar, nombrePaciente)
      .query(
        `SELECT 
               idPaciente, 
               nombrePaciente, 
               fechaNacimiento, 
               DATEDIFF(YEAR, fechaNacimiento, GETDATE()) -
               CASE 
                 WHEN MONTH(fechaNacimiento) > MONTH(GETDATE()) OR 
                      (MONTH(fechaNacimiento) = MONTH(GETDATE()) AND DAY(fechaNacimiento) > DAY(GETDATE()))
                 THEN 1 
                 ELSE 0 
               END AS edad
             FROM Pacientes 
             WHERE nombrePaciente = @nombrePaciente`
      );

    console.log("Resultado de la consulta:", result.recordset);

    if (result.recordset.length === 0) {
      console.log("Paciente no encontrado");
      return res.status(404).send("paciente no encontrado");
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error al buscar el paciente:", error);
    res.status(500).send("error al buscar el paciente");
  }
});





//agregar examenes
app.post("/api/examenes", async (req, res) => {
  try {
    const {
      idExamenPaciente,
      examen,
      fechaExamen,
      observaciones,
      recomendaciones,
    } = req.body;

    if (!idExamenPaciente || !examen || !fechaExamen) {
      return res
        .status(400)
        .send("idExamenPaciente, examen y fechaExamen son obligatorios");
    }

    const pool = await poolPromise;

    await pool
      .request()
      .input("idExamenPaciente", sql.Int, idExamenPaciente)
      .input("examen", sql.VarChar, examen)
      .input("fechaExamen", sql.Date, fechaExamen) // Agregar el input para la fecha
      .input("observaciones", sql.NVarChar(sql.MAX), observaciones || null)
      .input("recomendaciones", sql.NVarChar(sql.MAX), recomendaciones || null)
      .query(
        `INSERT INTO Examenes 
           (idExamenPaciente, examen, fecha, observaciones, recomendaciones) 
           VALUES 
           (@idExamenPaciente, @examen, @fechaExamen, @observaciones, @recomendaciones)`
      );

    res.status(200).send("Examen registrado correctamente");
  } catch (error) {
    console.error("Error al registrar el examen:", error);
    res.status(500).send("Error al registrar el examen");
  }
});

//obtener examenes de pacientes
app.get("/api/examenes", async (req, res) => {
  try {
    const { query, type } = req.query;
    const pool = await poolPromise;

    let result;
    if (query && type) {
      if (type === "identidad") {
        result = await pool
          .request()
          .input("identidadPaciente", query)
          .query(
            `SELECT 
              Examenes.idExamen, 
              Examenes.idExamenPaciente, 
              Examenes.fecha, 
              Examenes.examen, 
              Examenes.observaciones, 
              Examenes.recomendaciones,
              Pacientes.nombrePaciente, 
              Pacientes.identidadPaciente, 
              Pacientes.fechaNacimiento,
              DATEDIFF(YEAR, Pacientes.fechaNacimiento, GETDATE()) AS edad
            FROM Examenes
            JOIN Pacientes ON Examenes.idExamenPaciente = Pacientes.idPaciente
            WHERE Pacientes.identidadPaciente = @identidadPaciente
            ORDER BY Examenes.fecha DESC
            `
          );
      } else if (type === "nombre") {
        result = await pool
          .request()
          .input("nombrePaciente", `%${query}%`)
          .query(
            `SELECT 
              Examenes.idExamen, 
              Examenes.idExamenPaciente, 
              Examenes.fecha, 
              Examenes.examen, 
              Examenes.observaciones, 
              Examenes.recomendaciones,
              Pacientes.nombrePaciente, 
              Pacientes.identidadPaciente, 
              Pacientes.fechaNacimiento,
              DATEDIFF(YEAR, Pacientes.fechaNacimiento, GETDATE()) AS edad
            FROM Examenes
            JOIN Pacientes ON Examenes.idExamenPaciente = Pacientes.idPaciente
            WHERE Pacientes.nombrePaciente LIKE @nombrePaciente
            ORDER BY Examenes.fecha DESC`
          );
      }
    } else {
      result = await pool.query(
        `SELECT 
          Examenes.idExamen, 
          Examenes.idExamenPaciente, 
          Examenes.fecha, 
          Examenes.examen, 
          Examenes.observaciones, 
          Examenes.recomendaciones,
          Pacientes.nombrePaciente, 
          Pacientes.identidadPaciente, 
          Pacientes.fechaNacimiento,
          DATEDIFF(YEAR, Pacientes.fechaNacimiento, GETDATE()) AS edad
        FROM Examenes
        JOIN Pacientes ON Examenes.idExamenPaciente = Pacientes.idPaciente
        ORDER BY Examenes.fecha DESC
        `
      );
    }

    const examenes = result.recordset.map((examen) => ({
      idExamen: examen.idExamen,
      idExamenPaciente: examen.idExamenPaciente,
      fecha: examen.fecha,
      examen: examen.examen,
      observaciones: examen.observaciones,
      recomendaciones: examen.recomendaciones,
      nombrePaciente: examen.nombrePaciente,
      identidadPaciente: examen.identidadPaciente,
      edad: examen.edad,
    }));

    res.status(200).json(examenes);
  } catch (error) {
    console.error("Error al obtener los exámenes:", error);
    res.status(500).send("Error al obtener los exámenes");
  }
});

//eliminar examen
app.delete("/api/examenes/:idExamen", async (req, res) => {
  try {
    const idExamen = req.params.idExamen;
    const pool = await poolPromise;

    // eslint-disable-next-line no-unused-vars
    const result = await pool
      .request()
      .input("idExamen", idExamen)
      .query("DELETE FROM Examenes WHERE idExamen = @idExamen");

    res.status(200).send("Examen eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar el examen:", error);
    res.status(500).send("Error al eliminar el examen");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("servidor corriendo en el puerto:", PORT);
});
