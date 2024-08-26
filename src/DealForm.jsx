import React from 'react'
import {Row ,message ,Button , Flex, Popconfirm,Typography} from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Formpage.css'
import Dashboard from './Dashboard'
import { Link } from 'react-router-dom'
import './Dashboard.css'

 // this is message ele from antd
 function messageSuccess(){
    message.success('Sucessfully created')
 }

const DealForm = () => {
    const {Text} = Typography
    const navigation = useNavigate() //this is for navigation   
    const [errors,setError] = useState('')
    const [key,setID] = useState(()=> Math.floor(Math.random() * 1000000000))

      // this is for finding the name fron pathname to send  post request in that URL
    const URL = window.location.pathname
    const moduleName = URL.split('/').filter(e => e).shift()
    const id = URL.split('/').pop()
    
    const [dealdata,setDealData] = useState({
        key : JSON.stringify(key),
        id : id,
        dealowner:'',
        dealName : '',
        contactName:'',
        amount: '',
        Pipeline:'',
        closingDate:'',
        companyName:'',
        email:'',
        gender:'',
        area:'',
        state: '',
        country: '',
        pincode:'',
        expectedAmount:'',
        website:'',
        description: ''
    })
  
    // this is handle chanhge function
    const handleChange = (e)=>{
         const {name,value} = e.target
         setDealData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    }
    
    //this function for get data from form and make post request
    const onFinish = (e)=>{ 
      e.preventDefault()
          axios.post(`http://localhost:3000/deal`,dealdata)
            .then(res => {
              if (res.status === 201) {
                messageSuccess();
              }
          }).catch(err => {
            if (err.response) {
              message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
            } else if (err.request) {
              message.error('Error: No response   from server.');
            } else {
              message.error('Error: ' + err.message);
            }
        })
          setTimeout(()=>{
              navigate()
          },1 * 100) 
    }
  
    // this for navigation
      function navigate() {
        if (moduleName == 'account') {
          navigation(`/accountdetail/detail/${id}`)
        }else{
          navigation(`/contactDetail/detail/${id}`)
        }
      }
    
    // This for cancelling form
      function cancelForm() {
        navigate(`/${moduleName}`)
      }
  
    // validation Form
    function validation(leadFormValues) {      
      let errorvalues = {}
      if (!leadFormValues.dealowner.trim()) {
        errorvalues.dealowner = `${moduleName} Owner is Required`
      }
  
      if (!leadFormValues.dealName.trim()) {
          errorvalues.dealName = 'Deal Name is Required'
      }
  
      if (!leadFormValues.contactName.trim()) {
          errorvalues.contactName = 'Contact Name is Required'
      }
      
      if (!leadFormValues.closingDate.trim()) {
          errorvalues.closingDate = 'closing Date is is Required'
      }
      
      if (!leadFormValues.amount.trim()) {
        errorvalues.amount = 'Amount is Required'
    }
      
      if (!leadFormValues.Pipeline.trim()) {
          errorvalues.Pipeline = 'pipline is Required'
      }
      return errorvalues
    }
  
    //checking tthe form fileds are filled or not
    function checkForSubmitting(event) {
      let checkHavingErrorInInputField = Object.keys(validation(dealdata)).length === 0  // if it was greater than 0 that mean not fill the manditory field
      if (checkHavingErrorInInputField) {
         onFinish(event)
       }else{
         setError(validation(dealdata))
         message.error('Fill the Manditory Form Fields')
       }
    }
  
    // this is for showing red color (sending as a class name)
    function getInputClass(value){
      return errors[value] ? 'inputError' : ''
    }
  return (
  <div>  
    <Dashboard />
    <Row justify={'space-between'} style={{padding:'10px'}}>
      <Flex gap={"small"} align='center'> 
        <Text style={{fontSize:'16px',color:'grey'}}>
            <select name="layout" className='PoppinsFont'>
                <option value="Vadivel">{'vadivel'}</option>
                <option value="sakthi">{'sakthi'}</option>  
                <option value="Deepa">{'Deepa'}</option>  
                <option value="bharath">{'bharath'}</option>  
            </select>
        </Text>

        <Link to={'/formpage/formlayout'} > <Button type='link' className='PoppinsFont'>Create layout</Button> </Link>     
     </Flex>
      <Flex gap="small">
        <Button type='primary' danger ghost onClick={cancelForm} >Cancel</Button>
        <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={()=>message.error('Cancel Save')}>
          <Button type='primary' className='PoppinsFont' id='themeColor'>Submit</Button>  
        </Popconfirm>
      </Flex>
    </Row>

    <Row>
         <form onSubmit={checkForSubmitting} className='PoppinsFont'>
            <p>
                <label for="dealOwner">Deal Owner : </label>
                <input type="text" name="dealowner" id="DealOwner" placeholder="Deal Owner *" value={dealdata.dealowner} onChange={handleChange} className={getInputClass('dealowner')}/> 
            </p>
            
            <p>
                <label for="dealName">Deal Name : </label>
                <input type="text" name="dealName" id="dealName" placeholder="Deal Owner *" value={dealdata.dealName} onChange={handleChange} className={getInputClass('dealName')}/> 
            </p>

            <p>
                <label for="contactName">contact Name : </label>
                <input type="text" name="contactName" id="contactName" placeholder="contact Name *" value={dealdata.contactName} onChange={handleChange}  className={getInputClass('contactName')}/> 
            </p>

            <p>
                <label for="closingDate">Closing Date : </label>
                <input type="date" name="closingDate" id="date" placeholder="closing Date *" value={dealdata.date} onChange={handleChange} /> 
            </p>

            <p>
                <label for="amount">Amount : </label>
                <input type="number" name="amount" id="amount" placeholder="Amount *" value={dealdata.amount} onChange={handleChange} className={getInputClass('amount')}/> 
            </p>
            
            <p>
                <label for="expectedAmount">Expected Amount : </label>
                <input type="number" name="expectedAmount" id="expectedAmount" placeholder="Expected Amount" value={dealdata.expectedAmount} onChange={handleChange}/> 
            </p>

            <p>
                <label for="Pipeline">Pipeline : </label>
                <input type="text" name="Pipeline" id="Pipeline" placeholder="Pipeline *" value={dealdata.Pipeline} onChange={handleChange}  className={getInputClass('Pipeline')}/> 
            </p>

            <p> Stage </p>
                <input type="radio" id="stage1" name="pipeline" value="stage_1" />
                <label for="stage1">stage 1</label> 
                
                <input type="radio" id="stage2" name="pipeline" value="stage_2" />
                <label for="stage2">stage 2</label> 
                
                <input type="radio" id="stage3" name="pipeline" value="stage_3" />
                <label for="stage3">stage 3</label>

            <p>
                <label for="companyName">company Name : </label>
                <input type="text" name="companyName" id="companyName" placeholder="company Name" value={dealdata.companyName} onChange={handleChange}/> 
            </p>

            <p>
                <label for="mobile">Mobile Number : </label>
                <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number *" minLength={10} maxLength={10} value={dealdata.mobile} onChange={handleChange}  className={getInputClass('mobile')} /> 
            </p>            
                   
            <p>
                <label for="area">Area : </label>
                <input type="text" name="area" id="area" placeholder="Area" value={dealdata.area} onChange={handleChange}/> 
            </p>
            
            <p>
                <label for="state">State : </label>
                <input type="text" name="state" id="state" placeholder="State" value={dealdata.state} onChange={handleChange}/> 
            </p>
            <p>
                <label for="country">Country : </label>
                <input type="text" name="country" id="country" placeholder="Country" value={dealdata.country} onChange={handleChange}/> 
            </p>  

            <p>
                <label for="website">Website : </label>
                <input type="url" name="website" id="website" placeholder="Website" value={dealdata.website} onChange={handleChange}/> 
            </p>
          
            <p>
                <label for="annualrevenue">Annual Revenue : </label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={dealdata.annualrevenue} onChange={handleChange}/> 
            </p>
            
            <p>
                <label for="description">Description : </label>
                <textarea name="description" id="description" placeholder='Description' value={dealdata.description}  onChange={handleChange}/>
            </p>

         </form>
    </Row>
    </div>
  )
}

export default DealForm