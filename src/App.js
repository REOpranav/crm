import './App.css';
import { Routes, Route } from 'react-router-dom'
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
import AccountFormPage from './AccountFormPage';
import AccountEditForm from './AccountEditForm';
import ScheduleMeeting from './ScheduleMeeting';
import MeetingStep from './MeetingStep';
import MeetingDetail from './MeetingDetail';
import MeetingInsights from './MeetingInsights';
import DealEditForm from './DealEditForm';
import APIs from './RestAPI/APIs';
import MailLog from './MailLog';
import MailStep from './MailStep';
import SendMail from './SendMail';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/leads' element={<LeadBoard />} />
        <Route path='/contacts' element={<Contact />} />
        <Route path='/accounts' element={<Account />} />
        <Route path='/deals' element={<Deal />} />
        <Route path='/restapi' element={<APIs />} />
        <Route path='/leads/formpage' element={<FormPage />} />
        <Route path='/contacts/formpage' element={<FormPage />} />
        <Route path='/accounts/formpage' element={<AccountFormPage />} />
        <Route path='/leads/detail/:id' element={<Detail />} />
        <Route path='/contactDetail/detail/:id' element={<ContactDetail />} />
        <Route path='/leads/detail/leadeditform/:id' element={<DetailEditForm />} />
        <Route path='/contacts/contactDetail/contactEditForm/:id' element={<DetailEditForm />} />
        <Route path='/leads/formpage/formlayout' element={<FormLayout />} />
        <Route path='/contacts/formpage/formlayout' element={<FormLayout />} />
        <Route path='/accounts/formpage/formlayout' element={<FormLayout />} />
        <Route path='/accountdetail/detail/:id' element={<AccountDetail />} />
        <Route path='/accounts/accountDetail/accountEditForm/:id' element={<AccountEditForm />} />
        <Route path='/contacts/dealForm/:id' element={<DealForm />} />
        <Route path='/accounts/dealForm/:id' element={<DealForm />} />
        <Route path='/deal/editDeal/:id' element={<DealEditForm />} />
        <Route path='/contacts/innerdeal/:id' element={<InnerDeal />} />
        <Route path='/accounts/innerdeal/:id' element={<InnerDeal />} />
        <Route path='/deals/detail/:id' element={<DealDetail />} />
        <Route path='/contacts/individualForm/:id' element={<DealForm />} />
        <Route path='/contacts/organizationForm/:id' element={<DealForm />} />
        <Route path='/integrationStep' element={<MeetingStep />} />
        <Route path='/contactDetail/detail/:id/ScheduleMeeting/:id' element={<ScheduleMeeting />} />
        <Route path='/editing/ScheduleMeeting' element={<ScheduleMeeting />} />
        <Route path='/ScheduleMeeting' element={<ScheduleMeeting />} />
        <Route path='/meetingDetail' element={<MeetingDetail />} />
        <Route path='/meetingDetail/:id' element={<MeetingInsights />} />
        <Route path='/editing/meetingDetail/:id' element={<ScheduleMeeting />} />
        <Route path='/maillog' element={<MailLog />} />
        <Route path='/mailStep' element={<MailStep />}></Route>
        <Route path='/mailsend' element={<SendMail />} />
        <Route path='/mailsend/lead/:id' element={<SendMail />} />
      </Routes>
    </div>
  );
}

export default App;