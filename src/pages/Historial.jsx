import { useState} from "react";
import Reporte from "./document/Reporte";
import Home from "./Home";
import './historial.css';

function Historial() {
  const [examenes, setExamenes] = useState([]);
  const [identidadPaciente, setIdentidadPaciente] = useState("");

  const fetchExamenes = async (identidad) => {
    try {
      const response = await fetch(`http://localhost:5000/api/examenes/${identidad}`);
      if (response.ok) {
        const data = await response.json();
        setExamenes(data);
      } else {
        console.error("Error al obtener los exámenes:", await response.text());
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const handleDelete = async (idExamen) => {
    try {
      const response = await fetch(`http://localhost:5000/api/examenes/${idExamen}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExamenes(examenes.filter((examen) => examen.idExamen !== idExamen));
        window.alert("examen eliminado correctamente")
      } else {
        console.error("Error al eliminar el examen:", await response.text());
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const handleSearch = () => {
    fetchExamenes(identidadPaciente);
  };

  return (
    <div className="examenesContainer">
      <Home />
      <h1>Registro de Exámenes</h1>

      <div className="searchContainer">
        <input
          className="buscadorHistorial"
          type="text"
          placeholder="Ingrese número de identidad"
          value={identidadPaciente}
          onChange={(e) => setIdentidadPaciente(e.target.value)}
        />
        <button className="buscarHistorial" onClick={handleSearch}>Buscar</button>
      </div>
      {examenes.length > 0 ? (
        examenes.map((examen) => (
          <div key={examen.idExamen} className="examenBody">
            <h3 className="titleImportant">Examen de Paciente {examen.idExamenPaciente}</h3>
            <p>Nombre: {examen.nombrePaciente}</p>
            <p>Identidad: {examen.identidadPaciente}</p>
            <p>Edad: {examen.edad} años</p>
            <strong className="titleImportant">Observaciones:</strong>
            <p className="observaciones">{examen.observaciones}</p>
            <strong className="titleImportant">Recomendaciones:</strong>
            <p className="recomendaciones">{examen.recomendaciones}</p>
            <img src={examen.examen} alt="Examen" />
            <Reporte
              nombre={examen.nombrePaciente}
              edad={examen.edad}
              fecha={examen.fecha}
              observaciones={examen.observaciones}
              recomendaciones={examen.recomendaciones}
              imagen={examen.examen}
            />
            <button className="eliminar" onClick={() => handleDelete(examen.idExamen)}>Eliminar</button>
          </div>
        ))
      ) : (
        <p>No hay exámenes registrados</p>
      )}
    </div>
  );
}

export default Historial;
