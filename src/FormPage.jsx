import React from 'react'
import {Row , Form ,Input,message ,InputNumber ,Button , Flex} from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FormPage = () => {
  const navigation = useNavigate()
  
  //this is for navigation
  function navigate() {
      navigation('/leadboard')
    }

  const [formData,setFormData] = useState({
    firstname : '',
    lastname:'',
    email:'',
    mobile:'',
    companyName:'',
    annualrevenue: ''
  })

  const handleChange = (e)=>{
       const {name,value} = e.target
       setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  }

  const onFinish = (e)=>{
    e.preventDefault()
      axios.post('http://localhost:3000/leads',formData)
      .then(res => {
        if (res.status == 201) {
          messageSuccess();
          console.log(res.data);
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

  // this is message ele from antd
  function messageSuccess(){
     message.success('Sucessfully created a Lead')
    }

    setTimeout(()=>{
      navigate()
     },1 * 900)  
  }

  // this for cancelling form
  function cancelForm() {
      navigate('/leadBoard')
  }

  return (
  <div>
    
    <Row justify={'end'}>
      <Flex gap="small">
        <Button type='primary'  onClick={onFinish} >Submit</Button>
        <Button type='primary' danger onClick={cancelForm}>Cancel</Button>
      </Flex>
    </Row>

    <Row>
         <form onSubmit={onFinish}>
            <p>
                <label for="firstname"></label>
                <input type="text" name="firstname" id="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="lastname"></label>
                <input type="text" name="lastname" id="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange}  /> <br />
                <span></span>
            </p>

            <p>
                <label for="email"></label>
                <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="mobile"></label>
                <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="companyName"></label>
                <input type="text" name="companyName" id="companyName" placeholder="company Name" value={formData.companyName} onChange={handleChange} /> <br />
                <span></span>
            </p>


            <p>
                <label for="annualrevenue"></label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={formData.annualrevenue} onChange={handleChange} /> <br />
                <span></span>
            </p>
         </form>
    </Row>
    </div>
  )
}
export default FormPage