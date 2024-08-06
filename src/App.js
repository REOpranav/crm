import './App.css';
import { Form ,Row} from "antd";
import {Routes,Route} from 'react-router-dom'
import Dashboard from './Dashboard';
import FormPage from './FormPage';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/formpage' element={<FormPage />} />
        </Routes>
    </div>
  );
}

export default App;