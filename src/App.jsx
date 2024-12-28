import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Inicio from './pages/Inicio';
import Pacientes from './pages/Pacientes.jsx'
import Examenes from './pages/Examenes.jsx';
import Historial from './pages/Historial.jsx'
import Error from './pages/Error.jsx';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Inicio/>} />
          <Route path='/pacientes' element={<Pacientes/>}/>
          <Route path='/examenes' element={<Examenes/>}/>
          <Route path='/historial' element={<Historial/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
