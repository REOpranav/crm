import { Button, Col, Flex, message, Popconfirm, Row, Typography } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'

 // this is message ele from antd
 function messageSuccess(value){  
    message.success(`Sucessfully Update the ${value.firstname} Lead Datas`)
 }

 const AccountEditForm = () => {
    const {Text} = Typography
    const navigation = useNavigate() //this is for navigation   
    const urlParams = window.location.pathname //this code for getting url params

    const [fectedaccountDatas,setFetchedAccountData] = useState([])//this will fetch the full data from query param
    const [actualActualData,setActualActualData] = useState([]) // this data is filter data from lead datas
    const [errors,setError] = useState('')
    const [formData,setFormData] = useState({})

    const moduleName = urlParams.split('/').filter(e => e).shift().toLocaleLowerCase() // this is for getting the module name

    const fetching = async()=>{
      try {
      const responce = await axios.get(`http://localhost:3000/${moduleName}`) // fethch the data using the module name 
        if (responce.status === 200) {
            setFetchedAccountData(await responce.data);            
        }
      } catch (err) {
          if (err.response) {
              message.error('Error: ' + err.response.status +' - '+ (err.response.data.message || 'Server Error'));
          } else if (err.request) {
              message.error('Error: No response from server.');
          } else {
              message.error('Error: ' + err.message);
          }
      }
    }
    
    // initial fetch function occurs
    useEffect(()=>{
      fetching()      
    },[undefined])

    // make filteration after fetching function complete
    useEffect(()=>{
      let idNUmber = urlParams.split('/').pop() // get the endpoint for filter the partucaular person array       
       fectedaccountDatas.map((e) => {
          if (e.id === idNUmber) {
            setActualActualData(e)
          }
       })
    },[fetching])

    // set the lead data in secoundary form
    useEffect(() => {
      if (actualActualData) {
        
        setFormData({
          id :actualActualData.id,
          accountOwner:actualActualData.accountOwner,
          industry: actualActualData.industry || '',
          employeesCount: actualActualData.employeesCount || '',
          email: actualActualData.email || '',
          mobile: actualActualData.mobile || '',
          date:actualActualData.date || '',
          companyName: actualActualData.companyName || '',
          annualrevenue: actualActualData.annualrevenue || '',
          gender:actualActualData.gender || '',
          area:actualActualData.area || '',
          state:actualActualData.state ||  '',
          country: actualActualData.country || '',
          pincode:actualActualData.pincode || '',
          expectedAmount:actualActualData.expectedAmount || '',
          website:actualActualData.website || '',
          description:actualActualData.description || ''
        });
      }      
    }, [actualActualData]);

  // this is handle chanhge function
    const handleChange = (e)=>{
      const {name,value} = e.target    
      setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    }

  // validation Form
  function validation(leadFormValues) {
    let errorvalues = {}
    if (!leadFormValues.accountOwner.trim()) {
        errorvalues.accountOwner = 'Account Name is Required'
    }

    if (!leadFormValues.mobile.trim()) {
        errorvalues.mobile = 'Mobile Number is Required'
    }
    return errorvalues
  }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(e) {
    let checkHavingErrorInInputField = Object.keys(validation(formData)).length === 0 // if it was greater than 0 that mean not fill the manditory field
    if (checkHavingErrorInInputField) {
       onFinish(e)
     }else{            
       setError(validation(formData))
       message.error('Fill the Manditory Form Fields')
     }
  }

  // this code for patch work (onlu this problem)
  const onFinish = (e) => {
    e.preventDefault();
    const queryParam = formData.id // get the id for making Put request    
      axios.put(`http://localhost:3000/${moduleName}/${queryParam}`,formData)
      .then(res => {
        if (res.status === 200) {
          messageSuccess(res.data);
        }
      })
      .catch(error => {
        if (error.response) {
          message.error(`Error: ${error.response.status} - ${error.response.data.message || 'Server Error'}`);
        } else if (error.request) {
          message.error('Error: No response from server.');
        } else {
          message.error(`Error: ${error.message}`);
        }
      });
  
    setTimeout(() => {
      navigate();
    }, 100); 
  };
  
 // this for navigation
    function navigate() {
      navigation(`/${moduleName}`)
    }

    function backoneStep() {
       window.history.back()
    }
    
    function getInputClass(value){            
      return errors[value] ? 'inputError' : ''
    }
 
    return (
    <div>
  <Dashboard />
        <Row justify={'space-between'} >
          <Col>
           <Flex style={{padding:'10px',display:'flex',alignItems:'center'}} gap={'small'}>
              <Text style={{fontSize:'20px',fontWeight:'lighter',color:'grey',textTransform:'capitalize'}}>Edit {`${moduleName}`}</Text>
              <Text style={{fontSize:'15px',color:'red'}}>{`(${actualActualData.accountOwner})`}</Text>
           </Flex>
          </Col>
          <Col>
            <Flex gap={'small'} style={{padding:'10px'}}>
           
              <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={backoneStep} onCancel={()=>message.error('Process was cancel')}>
                <Button type='default'>Back one step</Button>  
              </Popconfirm>
               
              <Popconfirm title={'Are you sure to Submit'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={()=>message.error('Submit Cancelled')}>
                <Button type='primary'>save and close</Button>  
              </Popconfirm>
              
            </Flex>
          </Col>

        </Row>

        <Row justify={'center'}>
          <form onSubmit={checkForSubmitting}>
          <p>
                <label for="accountOwner">Owner : </label>
                <input type="text" name="accountOwner" id="accountOwner" placeholder={`${actualActualData.accountOwner} - Owner *`} value={formData.accountOwner} onChange={handleChange} className={getInputClass('accountOwner')}/> 
            </p>
            <p>
                <label for="industry">Industry : </label>
                <input type="text" name="industry" id="industry" placeholder={`${actualActualData.industry}* - industry`} value={formData.industry} onChange={handleChange} className={getInputClass('industry')}/>
            </p>

            <p>
                <label for="employeesCount">Employees Count : </label>
                <input type="text" name="employeesCount" id="employeesCount" placeholder={`${actualActualData.employeesCount} * - Employees Count`} value={formData.employeesCount} onChange={handleChange} className={getInputClass('employeesCount')}/>
            </p>

            <p>
                <label for="email">Email : </label>
                <input type="email" name="email" id="email" placeholder={`${actualActualData.email} * - Email`} value={formData.email} onChange={handleChange} className={getInputClass('email')}/>
            </p>

            <p>
                <label for="mobile">Mobile : </label>
                <input type="tel" name="mobile" id="mobile" placeholder={`${actualActualData.mobile} * - Mobile`} minLength={10} maxLength={10} value={formData.mobile} onChange={handleChange} className={getInputClass('mobile')} />
            </p>

            <p>
                <label for="companyName">Company Name : </label>
                <input type="text" name="companyName" id="companyName" placeholder={`${actualActualData.companyName} - Company Name`} value={formData.companyName} onChange={handleChange} />
            </p>

            <p>
                <label for="annualrevenue">Annual Revenue : </label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder={`${actualActualData.annualrevenue} - Annual Revenue`} value={formData.annualrevenue} onChange={handleChange} />
            </p>
            <p>
                <label for="gender">Gender : </label>
                <input type="text" name="gender" id="gender" placeholder={`${actualActualData.gender} - Gender`} value={formData.gender} onChange={handleChange}/>
            </p>
            <p>
                <label for="area">Area : </label>
                <input type="text" name="area" id="area" placeholder={`${actualActualData.area} - Area`} value={formData.area} onChange={handleChange}/>
            </p>
            <p>
                <label for="pincode">Pincode : </label>
                <input type="number" name="pincode" id="pincode" placeholder={`${actualActualData.pincode} - Pincode`} value={formData.pincode} onChange={handleChange}/>
            </p>
            <p>
                <label for="state">state : </label>
                <input type="text" name="state" id="state" placeholder={`${actualActualData.state} - Pincode`} value={formData.state} onChange={handleChange}/>
            </p>
            <p>
                <label for="country">Country : </label>
                <input type="text" name="country" id="country" placeholder={`${actualActualData.country} - Country`}value={formData.country} onChange={handleChange}/>
            </p>  
            <p>
                <label for="expectedAmount">Expected Amount : </label>
                <input type="text" name="expectedAmount" id="expectedAmount" placeholder={`${actualActualData.expectedAmount} - Expected Amount`} value={formData.expectedAmount} onChange={handleChange}/>
            </p>
            <p>
                <label for="website">Websites : </label>
                <input type="url" name="website" id="website" placeholder={`${actualActualData.website} - Websites`} value={formData.website} onChange={handleChange}/>
            </p>
            <p>
                <label for="description">Description : </label>
                <textarea name="description" id="description" placeholder={`${actualActualData.description}- Description`} value={formData.description}  onChange={handleChange}/>
            </p> 
         </form>
        </Row>
    </div>
  )
}

export default AccountEditForm