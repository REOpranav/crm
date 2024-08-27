import './App.css';
import {Routes,Route} from 'react-router-dom'
import LeadBoard from './LeadBoard';
import FormPage from './FormPage';
import Dashboard from './Dashboard';
import Detail from './Detail';
import Contact from './Contact';
import Account from './Account';
import Deal from './Deal';
import FormLayout from './FormLayout';
import ContactDetail from './ContactDetail';
import DetailEditForm from './DetailEditForm';
import AccountDetail from './AccountDetail';
import InnerDeal from './InnerDeal';
import DealForm from './DealForm';
import DealDetail from './DealDetail';

function App() {
  
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/leads' element={<LeadBoard />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/account' element={<Account />} />
          <Route path='/deal' element={<Deal />} />
          <Route path='/leads/formpage' element={<FormPage />} />
          <Route path='/contact/formpage' element={<FormPage />} />
          <Route path='/account/formpage' element={<FormPage />} />
          <Route path='/leads/detail/:id' element={<Detail/>} />
          <Route path='/contactDetail/detail/:id' element={<ContactDetail/>} />
          <Route path='/leads/detail/leadeditform/:id' element={<DetailEditForm />} />
          <Route path='/contact/contactDetail/contactEditForm/:id' element={<DetailEditForm />} />
          <Route path='/formpage/formlayout' element={<FormLayout/>} />
          <Route path='/accountdetail/detail/:id' element={<AccountDetail />} />
          <Route path='/account/accountDetail/accountEditForm/:id' element={<DetailEditForm />} />
          <Route path='/contact/dealForm/:id' element={<DealForm />} />
          <Route path='/account/dealForm/:id' element={<DealForm />} />
          <Route path='/contact/innerdeal/:id' element={<InnerDeal />} />
          <Route path='/account/innerdeal/:id' element={<InnerDeal />} />
          <Route path='/deal/detail/:id' element={<DealDetail />} />
          <Route path='/deal/individualForm/:id' element={<DealForm />} />
          <Route path='/deal/organizationForm/:id' element={<DealForm />} />
        </Routes>
    </div>
  );
}

export default App;