import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {sql,poolPromise} from './db.js'

const app = express()
app.use(bodyParser.json())
app.use(cors())

//ruta para insertar datos

app.post("/api/pacientes" ,async (req,res) => {
    try {
        const { NombrePaciente, fechaNacimiento, sexo, estadoCivil } = req.body;
        const pool = await poolPromise;

        // Insertar datos (INSERT)
        await pool.request()
            .input("NombrePaciente", sql.VarChar, NombrePaciente)
            .input("fechaNacimiento", sql.Date, fechaNacimiento)
            .input("sexo", sql.VarChar, sexo)
            .input("estadoCivil", sql.VarChar, estadoCivil)
            .query("INSERT INTO Pacientes (NombrePaciente, fechaNacimiento, sexo, estadoCivil) VALUES (@NombrePaciente, @fechaNacimiento, @sexo, @estadoCivil)");

        res.status(200).send("Datos insertados correctamente");
    } catch (error) {
        console.error("Error al insertar datos:", error);
        res.status(500).send("Error al insertar datos");
    }
})


const PORT = 5000;
app.listen(PORT, () => {
    console.log("servidor corriendo en el puerto:", PORT)
})