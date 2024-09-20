import React, { useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Flex, message, Popconfirm, Row, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

// this is for finding the name fron pathname to send  post request in that URL
const URL = window.location.pathname
const moduleName = URL.split('/').filter(e => e).shift()

// this is message ele from antd
 function messageSuccess(){
    message.success('Sucessfully created')
 }

  const required = {
    color : 'red'
  }

const AccountFormPage = () => {
   const {Text,Title} = Typography
   const navigation = useNavigate() //this is for navigation  
  
    const [id,setID] = useState(()=> Math.floor(Math.random() * 1000000000)) // this is for creating the ID
    const [error,setError] = useState("")
    const [accountData,setAccountData] = useState({
            id : JSON.stringify(id),
            accountOwner:'',
            industry: '',
            employeesCount:'',
            annualrevenue: '',
            mobile:'',
            email:'',
            date:'',
            companyName:'',
            gender:'',
            area:'',
            state: '',
            country: '',
            pincode:'',
            website:'',
            description: ''
    })

    // validation Form
    function validation(leadFormValues) {   
        let errorvalues = {}
        if (!leadFormValues.accountOwner.trim()) {
          errorvalues.leadowner = `${moduleName} Account owner is Required`
        }

    if (!leadFormValues.industry.trim()) {
        errorvalues.industry = 'Industry Name is Required'
    }

    if (!leadFormValues.employeesCount.trim()) {
        errorvalues.employeesCount = 'Employes Count is Required'
    }
    return errorvalues
  }

    //this function for get data from form and make post request
    const onFinish = (e)=>{ 
        e.preventDefault()
            axios.post(`http://localhost:3000/${moduleName}`,accountData)
              .then(res => {
                if (res.status === 201) {
                  messageSuccess();
                }
            }).catch(err => {
              if (err.response) {
                message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
              } else if (err.request) {
                message.error('Error: No response from server.');
              } else {
                message.error('Error: ' + err.message);
              }
          })
            setTimeout(()=>{
                navigate()
            },1 * 100) 
      }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(event) {
    let checkHavingErrorInInputField = Object.keys(validation(accountData)).length === 0  // if it was greater than 0 that mean not fill the manditory field
    if (checkHavingErrorInInputField) {
       onFinish(event)
     }else{
       setError(validation(accountData))
       message.error('Fill the Manditory Form Fields')
     }
  }

  function getInputClass(value){
    return error[value] ? 'inputError' : ''
  }

  // this is handle change function
    const handleChange = (e)=>{
        const {name,value} = e.target
        setAccountData((prevData) => ({
         ...prevData,
         [name]: value,
       }));
    }
   
    
  // this for navigation
    function navigate() {
      navigation(`/${moduleName}`)
    }

  // This for cancelling form
    function cancelForm() {
      navigate()
    }
  
  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}>
        <Flex gap={"small"} align='center'> 
            {/* <Text style={{fontSize:'16px',color:'grey'}}>
                <select name="layout" className='PoppinsFont'>
                    <option value="Vadivel">{'vadivel'}</option>
                    <option value="sakthi">{'sakthi'}</option>  
                    <option value="Deepa">{'Deepa'}</option>  
                    <option value="bharath">{'bharath'}</option>  
                </select>
            </Text>
             */}
            <Link to={'/accounts/formpage/formlayout'}> <Button type='default' className='PoppinsFont'>Create layout</Button> </Link> 
            <Text style={{fontSize:'25px',fontWeight:'lighter'}} className='PoppinsFont'>- Account Form</Text>

        </Flex>

        <Flex gap="small">
           <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={cancelForm} onCancel={()=>message.error('Cancelled')}>  
            <Button type='default' danger >Cancel</Button>
           </Popconfirm>
          
           <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={()=>message.error('Cancel Save')}>
            <Button type='primary' className='PoppinsFont' id='themeColor'>Submit</Button>  
           </Popconfirm>
        </Flex>

       
        </Row>

    <Row> 
         <form onSubmit={checkForSubmitting} className='PoppinsFont'>
            <p>
                <label for="accountOwner"> <span style={required}>* &nbsp;</span> Account Owner : </label>
                <input type="text" name="accountOwner" id="accountOwner" placeholder="Account Owner " value={accountData.accountOwner} onChange={handleChange} className={getInputClass('leadowner')}/> 
            </p>
            
            <p>
                <label for="industry"> <span style={required}>* &nbsp;</span> Industry : </label>
                <input type="text" name="industry" id="industry" placeholder="Industry " value={accountData.industry} onChange={handleChange} className={getInputClass('industry')}/> 
            </p>

            <p>
                <label for="employeesCount"> <span style={required}>* &nbsp;</span> Employees Count : </label>
                <input type="number" name="employeesCount" id="employeesCount" placeholder="Employees Count " value={accountData.employeesCount} onChange={handleChange}  className={getInputClass('employeesCount')}/> 
            </p>

            <p>
                <label for="annualrevenue"> Annual Revenue : </label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={accountData.annualrevenue} onChange={handleChange}/> 
            </p>
            
            <p>
                <label for="email">Email : </label>
                <input type="email" name="email" id="email" placeholder="Email" value={accountData.email} onChange={handleChange}  className={getInputClass('email')}/>
            </p>

            <p>
                <label for="mobile">Mobile Number : </label>
                <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number" minLength={10} maxLength={10} value={accountData.mobile} onChange={handleChange}  className={getInputClass('mobile')} /> 
            </p>
            
            <p>
                <label for="date">closing Date : </label>
                <input type="date" name="date" id="date" placeholder="closing Date *" value={accountData.date} onChange={handleChange} /> 
            </p>

            <p>
                <label for="companyName">company Name : </label>
                <input type="text" name="companyName" id="companyName" placeholder="company Name" value={accountData.companyName} onChange={handleChange}/> 
            </p>
           
            <p>
                <label for="gender">Gender : </label>
                <input type="text" name="gender" id="gender" placeholder="Gender" value={accountData.gender} onChange={handleChange}/> 
            </p>
           
            <p>
                <label for="area">Area : </label>
                <input type="text" name="area" id="area" placeholder="Area" value={accountData.area} onChange={handleChange}/> 
            </p>
            
            <p>
                <label for="pincode">Pincode : </label>
                <input type="number" name="pincode" id="pincode" placeholder="Pincode" value={accountData.pincode} onChange={handleChange}/> 
            </p>
            <p>
                <label for="state">State : </label>
                <input type="text" name="state" id="state" placeholder="State" value={accountData.state} onChange={handleChange}/> 
            </p>
            <p>
                <label for="country">Country : </label>
                <input type="text" name="country" id="country" placeholder="Country" value={accountData.country} onChange={handleChange}/> 
            </p>  
            <p>
                <label for="expectedAmount">Expected Amount : </label>
                <input type="text" name="expectedAmount" id="expectedAmount" placeholder="Expected Amount" value={accountData.expectedAmount} onChange={handleChange}/> 
            </p>
            <p>
                <label for="website">Website : </label>
                <input type="url" name="website" id="website" placeholder="Website" value={accountData.website} onChange={handleChange}/> 
            </p>
            <p>
                <label for="description">Description : </label>
                <textarea name="description" id="description" placeholder='Description' value={accountData.description}  onChange={handleChange}/>
            </p>

         </form>
    </Row>

    </div>
  )
}

export default AccountFormPage