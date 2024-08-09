/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Row ,Flex ,message, Typography,Popconfirm } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Col } from 'antd';
import { useNavigate } from 'react-router-dom'
import './LeadEditForm.css'

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

const LeadEditForm = () => {
   const {Text,Title} = Typography
    const navigation = useNavigate() //this is for navigation   
    const urlParams = window.location.pathname //this code for getting url params          
    const [leadDatas,setLeadDatas] = useState([])//this wil fetch the full data from query param
    const [lead,setLead] = useState([]) // this data is filter data from leaddatas

    const [formData,setFormData] = useState({ // this for changing the data
      firstname :'',
      lastname:'',
      email:'',
      mobile:'',
      date:'',
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
          leadowner:lead.leadowner,
          firstname: lead.firstname || '',
          lastname: lead.lastname || '',
          email: lead.email || '',
          mobile: lead.mobile || '',
          date:lead.date || '',
          companyName: lead.companyName || '',
          annualrevenue: lead.annualrevenue || '',
          gender:lead.gender || '',
          area:lead.area || '',
          state:lead.state ||  '',
          country: lead.country || '',
          pincode:lead.pincode || '',
          expectedAmount:lead.expectedAmount || '',
          website:lead.website || '',
          description:lead.description || ''
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
  function checkForSubmitting(e) {
    let checkHavingErrorInInputField = Object.keys(validation(formData)).length == 0 // if it was greater than 0 that mean not fill the manditory field
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

    function backoneStep() {
       navigation('/leadboard/detail/180556655')
    }
  return (
    <div>
        <Row justify={'space-between'} >
          <Col>
           <Flex style={{padding:'10px',display:'flex',alignItems:'center'}} gap={'small'}>
              <Text style={{fontSize:'20px',fontWeight:'bold'}}>Edit Lead</Text>
              <Text style={{fontSize:'15px',color:'grey'}}>{`(${lead.firstname})`}</Text>
           </Flex>
          </Col>
          <Col>
            <Flex gap={'small'} style={{padding:'10px'}}>
           
              <Popconfirm title={'Are you sure'} okText={'yes'} cancelText={'No'} onConfirm={backoneStep} onCancel={()=>message.error('Cancel Save')}>
                <Button type='default'>Back one step</Button>  
              </Popconfirm>
              
              <Popconfirm title={'Are you sure to Submit'} okText={'yes'} cancelText={'No'} onConfirm={checkForSubmitting} onCancel={()=>message.error('Submit Cancelled')}>
                <Button type='primary'>Submit</Button>  
              </Popconfirm>
              
              <Link to={'/leadboard'}>
                <Button type='default'>
                    LeadBoard
                </Button>
              </Link>
           
            </Flex>
          </Col>

        </Row>

        <Row justify={'center'}>
          <form onSubmit={checkForSubmitting}>
          <p>
                <label for="leadowner">Lead Owner : </label>
                <input type="text" name="leadowner" id="leadowner" placeholder={`${lead.leadowner} - Lead Owner *`} value={formData.leadowner} onChange={handleChange} /> <br />
                <span></span>
            </p>
            <p>
                <label for="firstname">First Name : </label>
                <input type="text" name="firstname" id="firstname" placeholder={`${lead.firstname}* - First Name`} value={formData.firstname} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="lastname">Last Name : </label>
                <input type="text" name="lastname" id="lastname" placeholder={`${lead.lastname} * - Last Name`} value={formData.lastname} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="email">Email : </label>
                <input type="email" name="email" id="email" placeholder={`${lead.email} * - Email`} value={formData.email} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="mobile">Mobile : </label>
                <input type="tel" name="mobile" id="mobile" placeholder={`${lead.mobile} * - Mobile`} minLength={10} maxLength={10} value={formData.mobile} onChange={handleChange} /> <br />
                <span></span>
            </p>

            <p>
                <label for="companyName">Company Name : </label>
                <input type="text" name="companyName" id="companyName" placeholder={`${lead.companyName} - Company Name`} value={formData.companyName} onChange={handleChange}/> <br />
                <span></span>
            </p>

            <p>
                <label for="annualrevenue">Annual Revenue : </label>
                <input type="number" name="annualrevenue" id="annualrevenue" placeholder={`${lead.annualrevenue} - Annual Revenue`} value={formData.annualrevenue} onChange={handleChange} /> <br />
                <span></span>
            </p>
            <p>
                <label for="gender">Gender : </label>
                <input type="text" name="gender" id="gender" placeholder={`${lead.gender} - Gender`} value={formData.gender} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="area">Area : </label>
                <input type="text" name="area" id="area" placeholder={`${lead.area} - Area`} value={formData.area} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="pincode">Pincode : </label>
                <input type="number" name="pincode" id="pincode" placeholder={`${lead.pincode} - Pincode`} value={formData.pincode} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="state">Pincode : </label>
                <input type="text" name="state" id="state" placeholder={`${lead.pincode} - Pincode`} value={formData.state} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="country">Country : </label>
                <input type="text" name="country" id="country" placeholder={`${lead.country} - Country`}value={formData.country} onChange={handleChange}/> <br />
                <span></span>
            </p>  
            <p>
                <label for="expectedAmount">Expected Amount : </label>
                <input type="text" name="expectedAmount" id="expectedAmount" placeholder={`${lead.expectedAmount} - Expected Amount`} value={formData.expectedAmount} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="website">Websites : </label>
                <input type="url" name="website" id="website" placeholder={`${lead.website} - Websites`} value={formData.website} onChange={handleChange}/> <br />
                <span></span>
            </p>
            <p>
                <label for="description">Description : </label>
                <textarea name="description" id="description" placeholder={`${lead.description}- Description`} value={formData.description}  onChange={handleChange}/>
                <span></span>
            </p> 
         </form>
        </Row>
    </div>
  )
}

export default LeadEditForm