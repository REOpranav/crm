import React, { useEffect } from 'react'
import { Row, message, Button, Flex, Popconfirm, Typography, Tooltip } from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './Formpage.css'
import './LeadEditForm.css'
import Dashboard from './Dashboard'
import './Dashboard.css'

// this is message ele from antd
function messageSuccess() {
  message.success('Sucessfully created')
}

const required = {
  color: 'red'
}

const DealForm = () => {
  const { Text } = Typography
  const navigation = useNavigate() //this is for navigation   
  const [errors, setError] = useState('')
  const [key, setID] = useState(() => Math.floor(Math.random() * 1000000000))
  const [accountData, setAccountData] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')

  // this is for finding the name fron pathname to send  post request in that URL
  const URL = window.location.pathname
  const splittingURL = URL.split('/')
  const moduleName = splittingURL.filter(e => e).shift()
  const id = URL.split('/').pop()
  const typeOfDealForm = splittingURL[2]
  const [stage, setStage] = useState('stage 1')

  const [dealdata, setDealData] = useState({
    key: JSON.stringify(key),
    id: '',
    dealowner: '',
    dealName: '',
    accountName: '',
    amount: '',
    Pipeline: '',
    stage: stage,
    closingDate: '',
    companyName: '',
    email: '',
    gender: '',
    area: '',
    state: '',
    country: '',
    pincode: '',
    expectedAmount: '',
    website: '',
    description: ''
  })


  useEffect(() => {
    setDealData(prevDealData => ({
      ...prevDealData,
      id: selectedAccount ? selectedAccount : id
    }));
  }, [undefined, selectedAccount])

  // this is handle chanhge function
  const handleChange = (e) => {
    const { name, value } = e.target
    setDealData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  //this function for get data from form and make post request
  const onFinish = (e) => {
    e.preventDefault()
    axios.post(`https://crm-server-opal.vercel.app/mongoDB/insertDeal`, dealdata)
      .then(res => {
        if (res.status === 201) {
          messageSuccess();
        }
      }).catch(err => {
        if (err.response) {
          message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
        } else if (err.request) {
          message.error('Error: No response   from server.');
        } else {
          message.error('Error: ' + err.message);
        }
      })
    setTimeout(() => {
      navigate()
    }, 1 * 100)
  }

  // this for navigation
  function navigate() {
    if (moduleName == 'accounts') {
      navigation(`/accountdetail/detail/${id}`)
    } else if (moduleName == "deals") {
      navigation(`/deals/detail/${id}`)
    } else {
      navigation(`/contactDetail/detail/${id}`)
    }
  }

  // This for cancelling form
  function cancelForm() {
    navigation(`/${moduleName}`)
  }

  // validation Form
  function validation(dealFormData) {
    let errorvalues = {}
    if (!dealFormData.dealowner.trim()) {
      errorvalues.dealowner = `${moduleName} Owner is Required`
    }

    if (!dealFormData.dealName.trim()) {
      errorvalues.dealName = 'Deal Name is Required'
    }

    if (!dealFormData.closingDate.trim()) {
      errorvalues.closingDate = 'Closing Date is Required'
    }

    if (!dealFormData.amount.trim()) {
      errorvalues.amount = 'closing Date is is Required'
    }
    return errorvalues
  }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(event) {

    let checkHavingErrorInInputField = Object.keys(validation(dealdata)).length === 0  // if it was greater than 0 that mean not fill the manditory field
    if (checkHavingErrorInInputField) {
      onFinish(event)
    } else {
      setError(validation(dealdata))
      message.error('Fill the Manditory Form Fields')
    }
  }

  // this is for showing red color (sending as a class name)
  function getInputClass(value) {
    return errors[value] ? 'inputError' : ''
  }

  // fething account data for look-ups
  const fetching = async () => {
    try {
      const responce = await axios.get(`https://crm-server-opal.vercel.app/mongoDB/accounts`)
      if (responce.status === 200) {
        setAccountData(await responce.data);
      }
    } catch (err) {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  }

  // initial fetch function occurs
  useEffect(() => {
    fetching()
  }, [undefined])

  // this navigation for new Account form page 
  function navigateToAccountForm() {
    navigation('/accounts/formpage')
  }

  const stages = ['stage 1', 'stage 2', 'stage 3', 'stage 4', 'win', 'loss']

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} style={{ padding: '10px' }}>
        <Flex gap={"small"} align='center'>
          <Link to={'/formpage/formlayout'} > <Button type='default' >Create layout</Button> </Link>
          <Text style={{ fontSize: '25px', fontWeight: 'lighter' }} className='PoppinsFont'>- Deal Form</Text>

        </Flex>
        <Flex gap="small">

          <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={cancelForm} onCancel={() => message.error('Discard changes')}>
            <Tooltip placement='left' title="Discard changes" color='red'> <Button type='default' danger ghost > Cancel </Button> </Tooltip>
          </Popconfirm>

          <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={() => message.error('cancel save')}>
            <Button type='default' className='PoppinsFont'>Submit</Button>
          </Popconfirm>

          <Button type='primary' className='PoppinsFont'>Back one step</Button>

        </Flex>
      </Row>

      <Row>
        <form onSubmit={checkForSubmitting} className='PoppinsFont'>
          <p>
            <label for="dealOwner"><span style={required}>* &nbsp;</span>Deal Owner : </label>
            <input type="text" name="dealowner" id="DealOwner" placeholder="Deal Owner" value={dealdata.dealowner} onChange={handleChange} className={getInputClass('dealowner')} />
          </p>

          <p>
            <label for="dealName"><span style={required}>* &nbsp;</span>Deal Name : </label>
            <input type="text" name="dealName" id="dealName" placeholder="Deal Name" value={dealdata.dealName} onChange={handleChange} className={getInputClass('dealName')} />
          </p>

          {typeOfDealForm == "organizationForm" && <p>
            <label for="accountName" ><span style={required}>* &nbsp;</span>Account Name : </label>
            <select id="account" value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
              <option value="" hidden>select Account</option>
              {accountData.map((e) => {
                return <option value={e.id} style={{ color: 'red' }} >{e.accountOwner}</option>
              })}
              <option value="new Account" onClick={navigateToAccountForm} style={{ color: 'blue' }}>Create New Account</option>
            </select>
          </p>}

          <p>
            <label for="closingDate"><span style={required}>* &nbsp;</span>Closing Date : </label>
            <input type="date" name="closingDate" id="closingDate" placeholder="closing Date" value={dealdata.date} onChange={handleChange} className={getInputClass('closingDate')} />
          </p>

          <p>
            <label for="amount"><span style={required}>* &nbsp;</span>Amount : </label>
            <input type="number" name="amount" id="amount" placeholder="Amount" value={dealdata.amount} onChange={handleChange} className={getInputClass('amount')} />
          </p>

          <p>
            <label for="expectedAmount">Expected Amount : </label>
            <input type="number" name="expectedAmount" id="expectedAmount" placeholder="Expected Amount" value={dealdata.expectedAmount} onChange={handleChange} />
          </p>

          <p>
            <label for="Pipeline">Pipeline : </label>
            <input type="text" name="Pipeline" id="Pipeline" placeholder="Pipeline" value={dealdata.Pipeline} onChange={handleChange} className={getInputClass('Pipeline')} />
          </p>

          <p>
            <label for="stages">stages : </label>
            <select name="stages" id="stages" value={stage} onChange={handleChange}>
              {stages.map((e) => {
                <option value="" hidden>Select Stage</option>
                return <option value={e}>{e}</option>
              })}
            </select>
          </p>

          <p>
            <label for="companyName">company Name : </label>
            <input type="text" name="companyName" id="companyName" placeholder="company Name" value={dealdata.companyName} onChange={handleChange} />
          </p>

          <p>
            <label for="mobile">Mobile Number : </label>
            <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number" minLength={10} maxLength={10} value={dealdata.mobile} onChange={handleChange} className={getInputClass('mobile')} />
          </p>

          <p>
            <label for="area">Area : </label>
            <input type="text" name="area" id="area" placeholder="Area" value={dealdata.area} onChange={handleChange} />
          </p>

          <p>
            <label for="state">State : </label>
            <input type="text" name="state" id="state" placeholder="State" value={dealdata.state} onChange={handleChange} />
          </p>
          <p>
            <label for="country">Country : </label>
            <input type="text" name="country" id="country" placeholder="Country" value={dealdata.country} onChange={handleChange} />
          </p>

          <p>
            <label for="website">Website : </label>
            <input type="url" name="website" id="website" placeholder="Website" value={dealdata.website} onChange={handleChange} />
          </p>

          <p>
            <label for="annualrevenue">Annual Revenue : </label>
            <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={dealdata.annualrevenue} onChange={handleChange} />
          </p>

          <p>
            <label for="description">Description : </label>
            <textarea name="description" id="description" placeholder='Description' value={dealdata.description} onChange={handleChange} />
          </p>

        </form>
      </Row>
    </div>
  )
}

export default DealForm