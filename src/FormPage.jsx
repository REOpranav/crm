import React, { useEffect } from 'react'
import {Row , Form ,Input,message ,InputNumber ,Button , Flex, Popconfirm} from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Formpage.css'

 // this is message ele from antd
  function messageSuccess(){
    message.success('Sucessfully created a Lead')
  }


const FormPage = () => {
  const navigation = useNavigate() //this is for navigation   
  const [id,setID] = useState(()=> Math.floor(Math.random() * 1000000000))
  
  const [formData,setFormData] = useState({
      id : JSON.stringify(id),
      leadowner:'',
      firstname : '',
      lastname:'',
      email:'',
      mobile:'',
      date:'',
      companyName:'',
      annualrevenue: '',
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
       setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  }

  //this function for get data from form and make post request
  const onFinish = (e)=>{ 
    e.preventDefault()  
        axios.post('http://localhost:3000/leads',formData)
          .then(res => {
            if (res.status == 201) {
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
      navigation('/leadboard')
    }
  
  // This for cancelling form
    function cancelForm() {
      navigate('/leadBoard')
    }

  // validation Form
  function validation(leadFormValues) {
    let errorvalues = {}
    if (!leadFormValues.firstname.trim()) {
        errorvalues.firstname = 'First Name is Required'
    }

    if (!leadFormValues.lastname.trim()) {
        errorvalues.lastname = 'Last Name is Required'
    }
    
    if (!leadFormValues.email.trim()) {
        errorvalues.email = 'Email Id is Required'
    }
    
    if (!leadFormValues.mobile.trim()) {
        errorvalues.mobile = 'Mobile Number is Required'
    }
    return errorvalues
  }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(event) {
    let checkHavingErrorInInputField = Object.keys(validation(formData)).length == 0 // if it was greater than 0 that mean not fill the manditory field
    if (checkHavingErrorInInputField) {
       onFinish(event)
     }else{
       message.error('Fill the Manditory Form Fields')
     }
  }

  return (
  <div>  
    <Row justify={'end'} style={{padding:'10px'}}>
      <Flex gap="small">
        <Button type='primary' danger onClick={cancelForm}>Cancel</Button>
        <Popconfirm title={'Are you sure to Edit this lead'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={()=>message.error('Cancel Save')}>
                <Button type='primary'>Submit</Button>  
        </Popconfirm>
      </Flex>
    </Row>

    <Row>
         <form onSubmit={checkForSubmitting}>
         <p>
                <label for="leadowner"></label>
                <input type="text" name="leadowner" id="leadowner" placeholder="Lead Owner *" value={formData.leadowner} onChange={handleChange} /> <br />
                <span></span>
            </p>
            <p>
                <label for="firstname"></label>
                <input type="text" name="firstname" id="firstname" placeholder="First Name *" value={formData.firstname} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="lastname"></label>
                <input type="text" name="lastname" id="lastname" placeholder="Last Name *" value={formData.lastname} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="email"></label>
                <input type="email" name="email" id="email" placeholder="Email *" value={formData.email} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="mobile"></label>
                <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number *" minLength={10} maxLength={10} value={formData.mobile} onChange={handleChange} /> <br />
                <span></span>
            </p>
            <p>
                <label for="date"></label>
                <input type="date" name="date" id="date" placeholder="closing Date *" value={formData.date} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="companyName"></label>
                <input type="text" name="companyName" id="companyName" placeholder="company Name" value={formData.companyName} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="gender"></label>
                <input type="text" name="gender" id="gender" placeholder="Gender" value={formData.gender} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="area"></label>
                <input type="text" name="area" id="area" placeholder="Area" value={formData.area} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="pincode"></label>
                <input type="number" name="pincode" id="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="state"></label>
                <input type="text" name="state" id="state" placeholder="State" value={formData.state} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="country"></label>
                <input type="text" name="country" id="country" placeholder="Country" value={formData.country} onChange={handleChange}/> <br />
                <span></span>
            </p>  
            <p>
                <label for="expectedAmount"></label>
                <input type="text" name="expectedAmount" id="expectedAmount" placeholder="Expected Amount" value={formData.expectedAmount} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="website"></label>
                <input type="url" name="website" id="website" placeholder="Website" value={formData.website} onChange={handleChange}/> <br />
                <span></span>
            </p>
          
            <p>
                <label for="annualrevenue"></label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={formData.annualrevenue} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="description"></label>
                <textarea name="description" id="description" placeholder='Description' value={formData.description}  onChange={handleChange}/>
                <span></span>
            </p>

         </form>
    </Row>
    </div>
  )
}
export default FormPage