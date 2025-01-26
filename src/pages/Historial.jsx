import { useState, useEffect } from "react";
import Reporte from "./document/Reporte";
import Home from "./Home";
import "./historial.css";

function Historial() {
  const [examenes, setExamenes] = useState([]);
  const [identidadPaciente, setIdentidadPaciente] = useState("");
  const [nombrePaciente, setNombrePaciente] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isBusquedaPorNombre, setIsBusquedaPorNombre] = useState(true);

  useEffect(() => {
    fetchExamenes(); // Fetch all exams on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExamenes = async () => {
    try {
      const query = isBusquedaPorNombre ? nombrePaciente : identidadPaciente;
      const type = isBusquedaPorNombre ? "nombre" : "identidad";

      const response = await fetch(
        `http://localhost:5000/api/examenes${
          query ? `?query=${query}&type=${type}` : ""
        }`
      );
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

  const handleSearch = () => {
    fetchExamenes();
  };

  const handleSearchTodos = () => {
    setNombrePaciente("")
    fetchExamenes();
  };

  return (
    <div className="examenesContainer">
      <Home />
      <h1>Registro de Exámenes</h1>
      <div className="searchContainer">
        <button className="todos" onClick={handleSearchTodos}>
          todos
        </button>
        <input
          className="buscadorHistorial"
          type="text"
          placeholder={
            isBusquedaPorNombre
              ? "Ingrese nombre del paciente"
              : "Ingrese número de identidad"
          }
          value={isBusquedaPorNombre ? nombrePaciente : identidadPaciente}
          onChange={(e) =>
            isBusquedaPorNombre
              ? setNombrePaciente(e.target.value)
              : setIdentidadPaciente(e.target.value)
          }
        />
        <button className="buscarHistorial" onClick={handleSearch}>
          Buscar
        </button>
        {/* <label>
          <input
            type="checkbox"
            checked={isBusquedaPorNombre}
            onChange={() => setIsBusquedaPorNombre(!isBusquedaPorNombre)}
          />
          Buscar por nombre
        </label> */}
      </div>

      <div className="gridContainer">
        {examenes.length > 0 ? (
          examenes.map((examen) => (
            <div key={examen.idExamen} className="gridItem">
              <p>Nombre: {examen.nombrePaciente}</p>
              <p>Fecha: {new Date(examen.fecha).toLocaleDateString()}</p>
              <p>Observaciones: {examen.observaciones}</p>
              <Reporte
                nombre={examen.nombrePaciente}
                edad={examen.edad}
                fecha={examen.fecha}
                observaciones={examen.observaciones}
                recomendaciones={examen.recomendaciones}
                imagen={examen.examen}
              />
            </div>
          ))
        ) : (
          <p>No hay exámenes registrados</p>
        )}
      </div>
    </div>
  );
}

export default Historial;
