import './App.css';
import { Form ,Row} from "antd";
import {Routes,Route} from 'react-router-dom'
import LeadBoard from './LeadBoard';
import FormPage from './FormPage';
import Dashboard from './Dashboard';
import Leadinfo from './Leadinfo';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/leadboard' element={<LeadBoard />} />
          <Route path='/formpage' element={<FormPage />} />
          <Route path='/leadboard/leadinfo/:id' element={<Leadinfo />} />
        </Routes>
    </div>
  );
}

export default App;