import './App.css';
import { Form ,Row} from "antd";
import {Routes,Route} from 'react-router-dom'
import LeadBoard from './LeadBoard';
import FormPage from './FormPage';
import Dashboard from './Dashboard';
import Detail from './Detail';
import LeadEditForm from './LeadEditForm';
import Contact from './Contact';
import Account from './Account';
import Deal from './Deal';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/leadboard' element={<LeadBoard />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/account' element={<Account />} />
          <Route path='/deal' element={<Deal />} />
          <Route path='/formpage' element={<FormPage />} />
          <Route path='/leadboard/detail/:id' element={<Detail/>} />
          <Route path='/leadboard/detail/leadeditform/:id' element={<LeadEditForm />} />
        </Routes>
    </div>
  );
}

export default App;