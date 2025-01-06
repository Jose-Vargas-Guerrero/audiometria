import "./Examenes.css";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import Reporte from "./document/Reporte";
import Home from "./Home";

const fileTypes = ["JPG", "PNG", "GIF  "];

function Examenes() {
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result); // Guardar la imagen como base64
    };
    reader.readAsDataURL(file); // Convertir a base64
  };

  //informacion de examen
  const [examen, setExamen] = useState({
    nombre: "abdul",
    edad: 0,
    fechaExamen: "",
    observaciones: "",
    recomendaciones: "",
    idPaciente: null,
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setExamen({
      ...examen,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(examen);
  };

  const [identidadPaciente, setIdentidadPaciente] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  //buscar paciente por el numero de identidad
  const handleSearch = async () => {
    try {
      const cleanIdentidad = identidadPaciente.trim()
      const response = await fetch(
        `http://localhost:5000/api/pacientes/${cleanIdentidad}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setResultado(data);
        console.log("este es el estado resultado:", resultado)
        setError(""); // Limpia errores previos
      } else {
        setResultado(null);
        setError("Paciente no encontrado");
      }
    } catch (err) {
      console.error("Error al buscar el paciente:", err);
      setError("Error en la conexión con el servidor");
    }
  };

  const handleSubmitExamen = async (e) => {
    e.preventDefault();
  
    // Validar que haya un paciente seleccionado
    if (!resultado?.idPaciente) {
      alert("Debe buscar y seleccionar un paciente antes de guardar el examen");
      return;
    }
  
    // Validar que el archivo exista
    if (!file) {
      alert("Debe cargar un archivo PDF del examen");
      return;
    }
  
    // Preparar datos para enviar
    const examenData = {
      idExamenPaciente: resultado.idPaciente, // ID del paciente
      examen: file, //imagen del examen
      observaciones: examen.observaciones,
      recomendaciones: examen.recomendaciones,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/examenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examenData),
      });
  
      if (response.ok) {
        alert("Examen guardado correctamente");
        setFile(null); // Limpiar el archivo cargado
        setExamen({
          nombre: "",
          edad: 0,
          fechaExamen: "",
          observaciones: "",
          recomendaciones: "",
          idPaciente: null,
        });
      } else {
        const errorText = await response.text();
        alert(`Error al guardar el examen: ${errorText}`);
      }
    } catch (error) {
      console.error("Error al enviar los datos del examen:", error);
      alert("Hubo un error al guardar el examen. Por favor, intente nuevamente.");
    }
  };
  

  
  

  return (
    <>
      <div className="examenesContainer">
        <Home/>
        <h1>Registro de examenes</h1>
        <div className="paciente">
          <h3>Agregar Paciente</h3>
          <input
            className="buscador"
            type="text"
            placeholder="Ingresar sin guiones"
            value={identidadPaciente}
            name="identidadPaciente"
            id="identidadPaciente"
            required
            onChange={(e) => setIdentidadPaciente(e.target.value)}
          />
          <button onClick={handleSearch} className="buscarPaciente">Buscar</button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {resultado && (
            <div className="resultado">
              <p>ID: {resultado.idPaciente}</p>
              <p>Nombre: {resultado.nombrePaciente}</p>
              <p>Edad: {resultado.edad}</p>
            </div>
          )}
        </div>
        <div className="inputFile">
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="image"
            types={fileTypes}
            uploadedLabel="Imagen Subida"
          />
          {/*           <p>
            {file ? `Nombre de archivo: ${file.name}` : "sin archivos subidos"}
          </p> */}
        </div>
        {file && (
          <div className="shadow">
            <img className="preview" src={file} alt="Preview" />
          </div>
        )}
        <form className="examenInfo" onSubmit={handleSubmit}>
          <label>Fecha</label>
          <input
            required
            type="date"
            id="fechaExamen"
            name="fechaExamen"
            placeholder="ingrese la fecha de el examen"
            onChange={handleInput}
          />
          <label>Observaciones</label>
          <textarea
            required
            className="observaciones"
            id="observaciones"
            name="observaciones"
            onChange={handleInput}
          />
          <label>Recomendaciones</label>
          <textarea
            required
            className="recomendaciones"
            id="recomendaciones"
            name="recomendaciones"
            onChange={handleInput}
          />
        </form>
        {/* mostrara el componente reporte si se carga una imagen */}
        {file ? (
          <Reporte
            nombre={resultado.nombrePaciente}
            edad={resultado.edad}
            fecha={examen.fechaExamen}
            observaciones={examen.observaciones}
            recomendaciones={examen.recomendaciones}
            imagen={file}
          />
        ) : null}
        <button className="guardar" onClick={handleSubmitExamen}>
          Guardar Examen
        </button>
      </div>
    </>
  );
}

export default Examenes;
