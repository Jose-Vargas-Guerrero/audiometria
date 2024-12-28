import { Link } from "react-router";
import "./Inicio.css";
import pacientes from "../images/circle-dashed-plus.png";
import examenes from "../images/ear-scan.png";
import historial from "../images/clipboard-data.png";

function Inicio() {
  return (
    <div className="Main">
      <h1>Sistema Clinica (nombre)</h1>
      <div className="buttonsContainer">
        <button className="button Pacientes">
          <Link to="/pacientes">
            <img className="icon" src={pacientes} />
          </Link>
          <p>Pacientes</p>
        </button>
        <button className="button Examenes">
          <Link to="/examenes">
            <img className="icon" src={examenes} />
          </Link>
          <p>Examenes</p>
        </button>
        <button className="button Historial">
          <Link to="/historial">
            <img className="icon" src={historial} />
          </Link>
          <p>Historial</p>
        </button>
      </div>
    </div>
  );
}

export default Inicio;
