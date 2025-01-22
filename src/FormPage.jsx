import { Row, message, Button, Flex, Popconfirm, Typography } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Formpage.css'
import Dashboard from './Dashboard'
import { Link } from 'react-router-dom'
import './Dashboard.css'

// this is message ele from antd
function messageSuccess() {
  message.success('Sucessfully created')
}

const required = {
  color: 'red'
}

const FormPage = () => {
  const { Text } = Typography
  const navigation = useNavigate() //this is for navigation
  const [errors, setError] = useState('')
  const [id, setID] = useState(() => Math.floor(Math.random() * 1000000000))
  const [layoutData, setLayoutData] = useState([]) // this get the layout data
  const [formLayoutName, setFormLayoutName] = useState([]) // this is layout selected value
  const layoutField = document.getElementById('customForm') || []
  const [filtering, setFilteing] = useState([])

  const [formData, setFormData] = useState({
    id: JSON.stringify(id),
    leadowner: '',
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    date: '',
    companyName: '',
    annualrevenue: '',
    gender: '',
    area: '',
    state: '',
    country: '',
    pincode: '',
    expectedAmount: '',
    website: '',
    description: ''
  })

  // this is handle chanhge function
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // this is for finding the name fron pathname to send  post request in that URL
  const URL = window.location.pathname
  const moduleName = URL.split('/').filter(e => e).shift()

  //this function for get data from form and make post request
  const onFinish = (e) => {
    e.preventDefault()
    let actualModuleName;
    if (moduleName == 'leads') {
      actualModuleName = 'insertLead'
    } else if (moduleName == 'contacts') {
      actualModuleName = 'insertContact'
    }    
    axios.post(`https://crm-server-opal.vercel.app/mongoDB/${actualModuleName}`, {
      indertingData: formData
    }).then(res => {
      if (res.status == 200) {
        messageSuccess();
        setTimeout(() => {
          navigate()
        }, 1 * 100)
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
  }

  // this for navigation
  function navigate() {
    navigation(`/${moduleName}`)
  }

  // This for cancelling form
  function cancelForm() {
    navigate()
  }

  // validation Form
  function validation(leadFormValues) {

    // this is for validate email
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }

    let errorvalues = {}
    if (!leadFormValues.leadowner.trim()) {
      errorvalues.leadowner = `${moduleName} Owner is Required`
    }

    if (!leadFormValues?.firstname.trim()) {
      errorvalues.firstname = 'First Name is Required'
    }

    if (!leadFormValues?.lastname.trim()) {
      errorvalues.lastname = 'Last Name is Required'
    }

    if (!leadFormValues.email.trim() || !validateEmail(leadFormValues?.email)) {
      errorvalues.email = 'Email Id is Required'
    }

    if (!leadFormValues.mobile.trim()) {
      errorvalues.mobile = 'Mobile Number is Required'
    }
    return errorvalues
  }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(event) {
    let checkHavingErrorInInputField = Object.keys(validation(formData)).length === 0  // if it was greater than 0 that mean not fill the manditory field
    if (checkHavingErrorInInputField) {
      onFinish(event)
    } else {
      setError(validation(formData))
      message.error('Fill the Manditory Form Fields')
    }
  }

  function getInputClass(value) {
    return errors[value] ? 'inputError' : 'errorClear'
  }

  // this functionf fetch the datas from URL/contact 
  const fetching = async () => {
    try {
      const responce = await axios.get('http://localhost:3000/formLayout')
      if (responce.status === 200) {
        setLayoutData(await responce.data);
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

  useEffect(() => {
    fetching()
  }, [undefined])

  useEffect(() => {
    layoutData.filter((e) => {
      if (e.id == formLayoutName) {
        setFilteing([e]) // sending the object like a array
      }
    })
  }, [formLayoutName, undefined])

  // back function
  const backFunction = () => {
    return window.history.back(-1)
  }

  return (

    <div>
      <Dashboard />
      <Row justify={'space-between'} style={{ padding: '10px' }}>
        <Flex gap={"small"} align='center'>
          <Text style={{ fontSize: '16px', color: 'grey' }}>
            <select name="layout" className='PoppinsFont' value={formLayoutName} onChange={(e) => setFormLayoutName(e.target.value)}>
              <option value="" selected hidden>select Layout</option>
              {layoutData.map((e) => {
                return <option value={e.id} >{e.id}</option>
              })}
            </select>
          </Text>

          <Link to={`/${moduleName}/formpage/formlayout`} > <Button type='link' className='PoppinsFont'>Create layout</Button> </Link>
        </Flex>
        <Flex gap="small">
          <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={cancelForm} onCancel={() => message.error('Cancelled')}>
            <Button type='default' danger ghost> Cancel </Button>
          </Popconfirm>

          <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={() => message.error('Cancel Save')}>
            <Button type='default' className='PoppinsFont' >Submit</Button>
          </Popconfirm>

          <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={backFunction} onCancel={() => message.info('Cancelled.Everything stay with us!')}>
            <Button type='primary'> Back one step </Button>
          </Popconfirm>
        </Flex>
      </Row>

      <Row>
        {formLayoutName.length === 0 &&
          <form onSubmit={checkForSubmitting} className='PoppinsFont'>
            <p>
              <label for="leadowner"><span style={required}>* &nbsp;</span>Owner : </label>
              <input type="text" name="leadowner" id="leadowner" placeholder="Owner" value={formData.leadowner} onChange={handleChange} className={getInputClass('leadowner')} />
            </p>

            <p>
              <label for="firstname"><span style={required}>* &nbsp;</span>First Name : </label>
              <input type="text" name="firstname" id="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} className={getInputClass('firstname')} />
            </p>

            <p>
              <label for="lastname"><span style={required}>* &nbsp;</span>Last Name : </label>
              <input type="text" name="lastname" id="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} className={getInputClass('lastname')} />
            </p>

            <p>
              <label for="email"><span style={required}>* &nbsp;</span>Email : </label>
              <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
            </p>

            <p>
              <label for="mobile"><span style={required}>* &nbsp;</span>Mobile Number : </label>
              <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number" minLength={10} maxLength={10} value={formData.mobile} onChange={handleChange} className={getInputClass('mobile')} />
            </p>

            <p>
              <label for="date">closing Date : </label>
              <input type="date" name="date" id="date" placeholder="closing Date" value={formData.date} onChange={handleChange} />
            </p>

            <p>
              <label for="companyName">company Name : </label>
              <input type="text" name="companyName" id="companyName" placeholder="company Name" value={formData.companyName} onChange={handleChange} />
            </p>

            <p>
              <label for="gender">Gender : </label>
              <input type="text" name="gender" id="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
            </p>

            <p>
              <label for="area">Area : </label>
              <input type="text" name="area" id="area" placeholder="Area" value={formData.area} onChange={handleChange} />
            </p>

            <p>
              <label for="pincode">Pincode : </label>
              <input type="number" name="pincode" id="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
            </p>
            <p>
              <label for="state">State : </label>
              <input type="text" name="state" id="state" placeholder="State" value={formData.state} onChange={handleChange} />
            </p>
            <p>
              <label for="country">Country : </label>
              <input type="text" name="country" id="country" placeholder="Country" value={formData.country} onChange={handleChange} />
            </p>
            <p>
              <label for="expectedAmount">Expected Amount : </label>
              <input type="text" name="expectedAmount" id="expectedAmount" placeholder="Expected Amount" value={formData.expectedAmount} onChange={handleChange} />
            </p>
            <p>
              <label for="website">Website : </label>
              <input type="url" name="website" id="website" placeholder="Website" value={formData.website} onChange={handleChange} />
            </p>

            <p>
              <label for="annualrevenue">Annual Revenue : </label>
              <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={formData.annualrevenue} onChange={handleChange} />
            </p>
            <p>
              <label for="description">Description : </label>
              <textarea name="description" id="description" placeholder='Description' value={formData.description} onChange={handleChange} />
            </p>

          </form>
        }

        {formLayoutName.length > 0 &&
          <form onSubmit={checkForSubmitting} className='PoppinsFont' id='customForm'>
            {filtering.map((e) => {
              const inputs = e.inputs
              layoutField.innerHTML = ''
              inputs.forEach((a) => {
                layoutField.innerHTML += a
                const key = layoutField.firstChild.lastChild.name
                layoutField.setAttribute('value', `${formData[key]}`)
                layoutField.onchange = handleChange
              })
            })
            }
          </form>
        }
      </Row>
    </div>
  )
}
export default FormPage
