import './App.css';
import {Routes,Route} from 'react-router-dom'
import LeadBoard from './LeadBoard';
import FormPage from './FormPage';
import Dashboard from './Dashboard';
import Detail from './Detail';
import LeadEditForm from './DetailEditForm';
import Contact from './Contact';
import Account from './Account';
import Deal from './Deal';
import FormLayout from './FormLayout';
import ContactDetail from './ContactDetail';
import Calllogs from './Calllogs';
import DetailEditForm from './DetailEditForm';
import Emaillog from './Emaillog';

function App() {
  
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/leads' element={<LeadBoard />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/account' element={<Account />} />
          <Route path='/deal' element={<Deal />} />
          <Route path='/formpage' element={<FormPage />} />
          <Route path='/leads/detail/:id' element={<Detail/>} />
          <Route path='/contactDetail/detail/:id' element={<ContactDetail/>} />
          <Route path='/leads/detail/leadeditform/:id' element={<DetailEditForm />} />
          <Route path='/contact/contactDetail/contactEditForm/:id' element={<DetailEditForm />} />
          <Route path='/formpage/formlayout' element={<FormLayout/>} />
        </Routes>
    </div>
  );
}

export default App;