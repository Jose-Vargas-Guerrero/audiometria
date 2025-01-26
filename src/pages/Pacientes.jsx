import { useState } from "react";
import "./Pacientes.css";
import Home from "./Home";

function Pacientes() {
  const [formulario, setFormulario] = useState({
    nombrePaciente: "",
    identidadPaciente: "",
    fechaNacimiento: "",
    sexo: "",
    estadoCivil: "undefined",
    lugarProcedencia: "",
    edad: 0,  // Agregamos la propiedad de edad
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const calcularEdad = (fechaNacimiento) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();
    if (mes < nacimiento.getMonth() || (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculamos la edad antes de enviar el formulario
    const edadCalculada = calcularEdad(formulario.fechaNacimiento);
    setFormulario({
      ...formulario,
      edad: edadCalculada,
    });
    
    console.log("formulario antes de enviar", formulario);
    try {
      const response = await fetch("http://localhost:5000/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });
      if (response.ok) {
        alert("Datos enviados correctamente");
      } else {
        alert("Error al enviar datos");
      }
    } catch (error) {
      console.log(error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <>
      <div className="pacientesPage">
        <Home />
        <h1>Registro de paciente</h1>
        <form className="formularioPacientes" onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            required
            id="nombrePaciente"
            name="nombrePaciente"
            value={formulario.nombrePaciente}
            onChange={handleInput}
            placeholder="nombre completo"
          />
          <label>Numero de identidad</label>
          <input
            required
            id="identidadPaciente"
            name="identidadPaciente"
            value={formulario.identidadPaciente}
            onChange={handleInput}
            placeholder="ingrese la identidad"
          />
          <label>Fecha nacimiento</label>
          <input
            required
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formulario.fechaNacimiento}
            onChange={handleInput}
            placeholder="ingrese la fecha de nacimiento"
          />
          <br/>
          {formulario.fechaNacimiento && (
            <strong>Edad: {calcularEdad(formulario.fechaNacimiento)}</strong>
          )}
          <br />
          <fieldset>
            <legend>Sexo</legend>
            <input
              required
              type="radio"
              name="sexo"
              id="masculino"
              value="masculino"
              onChange={handleInput}
              checked={formulario.sexo === "masculino"}
            />
            <label>Masculino</label>
            <input
              required
              type="radio"
              name="sexo"
              id="femenino"
              value="femenino"
              checked={formulario.sexo === "femenino"}
              onChange={handleInput}
            />
            <label>Femenino</label>
          </fieldset>
          <br />
          {/* <fieldset>
            <legend>Estado civil</legend>
            <input
              required
              type="radio"
              name="estadoCivil"
              id="casado"
              value="casado"
              checked={formulario.estadoCivil === "casado"}
              onChange={handleInput}
            />
            <label>Casado</label>
            <input
              required
              type="radio"
              name="estadoCivil"
              id="soltero"
              value="soltero"
              checked={formulario.estadoCivil === "soltero"}
              onChange={handleInput}
            />
            <label>Soltero</label>
            <input
              required
              type="radio"
              name="estadoCivil"
              id="viudo"
              value="viudo"
              checked={formulario.estadoCivil === "viudo"}
              onChange={handleInput}
            />
            <label>Viudo</label>
            <input
              required
              type="radio"
              name="estadoCivil"
              id="divorciado"
              value="divorciado"
              checked={formulario.estadoCivil === "divorciado"}
              onChange={handleInput}
            />
            <label>Divorciado</label>
          </fieldset> */}
          <label>lugar Procedencia</label>
          <input
            required
            id="lugarProcedencia"
            name="lugarProcedencia"
            value={formulario.lugarProcedencia}
            onChange={handleInput}
            placeholder="ingresar"
          />
          <br />
          <button type="submit">Agregar</button>
        </form>
      </div>
    </>
  );
}

export default Pacientes;
