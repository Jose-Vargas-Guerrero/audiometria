import "./Examenes.css";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import Reporte from "./document/Reporte";
import Home from "./Home";

const fileTypes = ["JPG", "PNG", "GIF"];

function Examenes() {
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Información de examen
  const [examen, setExamen] = useState({
    nombre: "",
    edad: 0,
    fechaExamen: getCurrentDate(),
    observaciones: "",
    recomendaciones: "",
    idPaciente: null,
  });
  const handleInput = (e) => {
    const { name, value } = e.target;
    setExamen((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(examen);
  };

  const [identidadPaciente, setIdentidadPaciente] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const cleanIdentidad = identidadPaciente.trim();
      const response = await fetch(
        `http://localhost:5000/api/pacientes/${cleanIdentidad}`
      );
      if (response.ok) {
        const data = await response.json();
        setResultado(data);
        setError("");
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

    if (!resultado?.idPaciente) {
      alert("Debe buscar y seleccionar un paciente antes de guardar el examen");
      return;
    }

    if (!file) {
      alert("Debe cargar un archivo PDF del examen");
      return;
    }

    const examenData = {
      idExamenPaciente: resultado.idPaciente,
      examen: file,
      fechaExamen: examen.fechaExamen,
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
        setFile(null);
        setExamen({
          nombre: "",
          edad: 0,
          fechaExamen: getCurrentDate(),
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
      alert(
        "Hubo un error al guardar el examen. Por favor, intente nuevamente."
      );
    }
  };

  return (
    <>
      <div className="examenesContainer">
        <Home />
        <h1>Registro de examenes</h1>
        <div className="paciente">
          <h3>Agregar Paciente</h3>
          <input
            className="buscador"
            type="text"
            placeholder="Identidad sin guiones"
            value={identidadPaciente}
            name="identidadPaciente"
            id="identidadPaciente"
            required
            onChange={(e) => setIdentidadPaciente(e.target.value)}
          />
          <button onClick={handleSearch} className="buscarPaciente">
            Buscar
          </button>

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
            value={examen.fechaExamen}
            onChange={handleInput}
          />

          <label>Observaciones</label>
          <textarea
            required
            className="observaciones"
            id="observaciones"
            name="observaciones"
            value={examen.observaciones}
            onChange={handleInput}
          />
          <label>Recomendaciones</label>
          <textarea
            required
            className="recomendaciones"
            id="recomendaciones"
            name="recomendaciones"
            value={examen.recomendaciones}
            onChange={handleInput}
          />
        </form>
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
