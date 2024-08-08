/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Row ,Flex ,message} from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Col } from 'antd';
import { useNavigate } from 'react-router-dom'

 /* Flow of This Components
      1. get the URL/endpoint for searching particular lead data 
         1.get the last endpoint (line - 65)
      2. make a fetch request to MOCK JSON-SERVER
      3. after fetch the data ,set that data in setLeadDatas
      4. using that setleadData variable ,first extract the leadID and compare which id is match in endpoint (line - 65)
      5. if any id are availabe set the particular lead data in setLead varible (line - 70) 
      6. after getting lead , apply this lead data as a value of editable form
      7. make a the form editable
      8. make put request 
      9. changes happend
 
 */ 



 // this is message ele from antd
 function messageSuccess(value){  
    message.success(`Sucessfully Update the ${value.firstname} Lead Datas`)
 }

const Leadinfo = () => {
    const navigation = useNavigate() //this is for navigation   
    const urlParams = window.location.pathname //this code for getting url params          
    const [leadDatas,setLeadDatas] = useState([])//this wil fetch the full data from query param
    const [lead,setLead] = useState([]) // this data is filter data from leaddatas

    const [formData,setFormData] = useState({ // this for changing the data
      firstname :'',
      lastname:'',
      email:'',
      mobile:'',
      companyName:'',
      annualrevenue:''
    })

    const fetching = async()=>{
    try {
      const responce = await axios.get('http://localhost:3000/leads')
        if (responce.status === 200) {
            setLeadDatas(await responce.data);            
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
        leadDatas.map((e) => {
          if (e.id === idNUmber) {
            setLead(e)
          }
       })
    },[fetching])

    // set the lead data in secoundary form
    useEffect(() => {
      if (lead) {
        setFormData({
          id :lead.id,
          firstname: lead.firstname || '',
          lastname: lead.lastname || '',
          email: lead.email || '',
          mobile: lead.mobile || '',
          companyName: lead.companyName || '',
          annualrevenue: lead.annualrevenue || ''
        });
      }      
    }, [lead]);

  // this is handle chanhge function
    const handleChange = (e)=>{
      const {name,value} = e.target    
      setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(e) {
    let checkHavingErrorInInputField = true
    if (checkHavingErrorInInputField) {
       onFinish(e)
     }else{
       message.error('Fill the Manditory Form Fields')
     }
  }

  // this code for patch work (onlu this problem)
  const onFinish = (e) => {
    e.preventDefault();
    const queryParam = formData.id // get the id for making Put request
      axios.put(`http://localhost:3000/leads/${queryParam}`,formData)
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
      navigation('/leadboard')
    }

  return (
    <div>
        <Row justify={'end'}>
          <Flex gap={'small'} style={{padding:'10px'}}>
            <Button type='primary' onClick={checkForSubmitting} >Submit</Button>
            <Button type='default'>
                <Link to={'/leadboard'}>LeadBoard</Link>
            </Button>
          </Flex>
        </Row>

        <Row justify={'center'}>
          <Col>
          <form onSubmit={checkForSubmitting}>
            <p>
                <label for="firstname"></label>
                <input type="text" name="firstname" id="firstname" placeholder={lead.firstname} value={formData.firstname} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="lastname"></label>
                <input type="text" name="lastname" id="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="email"></label>
                <input type="email" name="email" id="email" placeholder="Email" value={formData.email} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="mobile"></label>
                <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number" minLength={10} maxLength={10} value={formData.mobile} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="companyName"></label>
                <input type="text" name="companyName" id="companyName" placeholder="company Name" value={formData.companyName} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="annualrevenue"></label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" value={formData.annualrevenue} onChange={handleChange} /> <br />
                <span></span>
            </p>
            <p>
              <input type="submit" />
            </p>
         </form>
            </Col>
        </Row>
    </div>
  )
}

export default Leadinfo