import React, { useEffect, useState } from 'react'
import {message,Typography,Row,Col,Flex,Button,Dropdown,Popconfirm} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dashboard from './Dashboard'
import InnerDeal from './InnerDeal'
import moment from 'moment'
import Calllogs from './Calllogs'
import './Dashboard.css'

const ContactDetail = () => {
    
  // this is message ele from antd
    function messageSuccess(){
      message.success('Sucessfully created a Lead')
    }

    const [contactData,setContactData] = useState([])
    const {Title,Text} = Typography // antd
    const [mailLog,setMailLogs] = useState('')
    const navigation = useNavigate() //this is for navigation
    const [callLogs,setCallLogs] = useState('')
    const [selectRowKey,setSelectedRowKey] = useState('')   

    // this is for get the current id
    const URL = window.location.href
    const id = URL.split('/').pop()

    // this code for initial load and when lead added
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/contact/${id}`)         
                if (responce.status === 200) {
                    setContactData(await responce.data)
                }
            } catch (err) {
                if (err.response) {
                    message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
                } else if (err.request) {
                    message.error('Error: No response from server.');
                } else {
                    message.error('Error: ' + err.message);
                }
              }
          }

        useEffect(()=>{
            fetching()
        },[undefined,selectRowKey])

        function navigateToAccount() {
          navigation('/account')
        }

      // this code for convert lead to contact
      const convertToAccount = async()=>{ 
        let dataFromLead = await axios.get(`http://localhost:3000/contact/${id}`) // first getting the particular id
        await axios.post('http://localhost:3000/account',dataFromLead.data) // secound post that contact form
          .then(res => {
            if (res.status === 201) {
              messageSuccess();
            }
            axios.delete(`http://localhost:3000/contact/${id}`) // third code for deleting data in lead

            setTimeout(()=>{
                navigateToAccount()
            },1 * 100) 

          }).catch(err => {
            if (err.response) {
              message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
            } else if (err.request) {
              message.error('Error: No response   from server.');
            } else {
              message.error('Error: ' + err.message);
            }
      }) 
     }
  
     // this is for drop down (ANTd)
        const items = [
            {
              key: '1',
              label: (<Link onClick={convertToAccount}>Convert to Accounts</Link> ),
            },
            {
              key: '2',
              label: ( <Link to={'/deal'}>Convert to Deal</Link>),
            }
        ]

    // this is for store the call log
    const makeCall = (number) => {
        const data = {
            id : id,
            date :moment().format('MMMM Do YYYY, h:mm:ss a')
        }
      
        if (number) {
          const logPost = async()=>{
            try {
                  const URL = `http://localhost:3000/callLogs`
                  const posting = await axios.post(URL,data) // post the data
                  const getCallLogs = await axios.get(URL)
                    if (getCallLogs.status === 200) {
                      setCallLogs(getCallLogs.data)                      
                    }   
                    if (posting.status === 201) {
                      message.success('Calls are stored in Call log')
                    }
                    if (posting.status === 201) {
                      window.location.href = `tel:${number}`
                    }
                } catch (err) {
                  if (err.response) {
                    message.error('Error: ' + err.response.status+' - '+ ( err.response.data.message || 'Server Error'));
                  } else if (err.request) {
                    message.error('Error: No response   from server.');
                  } else {
                    message.error('Error: ' + err.message);
                  }
                }
              }
            logPost()            
        }
      };

    // this is for store the Mail log
    const makeMail = (number) => {      
      const data = {
          id : id,
          date :moment().format('MMMM Do YYYY, h:mm:ss a')
      }
    
      if (number) {
        const logPost = async()=>{
          try {
                const URL = `http://localhost:3000/emailLogs`
                const posting = await axios.post(URL,data) // post the data
                const getMailLog = await axios.get(URL)
                  if (getMailLog.status === 200) {
                    setMailLogs(getMailLog.data)                      
                  }
                  if (posting.status === 201) {
                    message.success('Mail are stored in Mail log')
                  }
                  if (posting.status === 201) {
                    window.location.href = `mailto:${number}`
                  }
              } catch (err) {
                if (err.response) {
                  message.error('Error: ' + err.response.status+' - '+ ( err.response.data.message || 'Server Error'));
                } else if (err.request) {
                  message.error('Error: No response   from server.');
                } else {
                  message.error('Error: ' + err.message);
                }
              }
            }
          logPost()            
      }
    };

   // this is for deleting the leads
   const dealDelete = async()=>{
    console.log(selectRowKey); 
    try {
      const URL = `http://localhost:3000/deal`
      let deleting ; 
        for (const deleteValue of selectRowKey) {
          deleting =  await axios.delete(`${URL}/${deleteValue}`)        
        }
        if (deleting.status === 200) {
          message.success("sucessfully Deleted the data") 
        }
        setSelectedRowKey(0)
      } catch (err) {
        if (err.response) {
              message.error('Error: ' + err.response.status+' - '+ ( err.response.data.message || 'Server Error'));
        } else if (err.request) {
              message.error('Error: No response   from server.');
        } else {
              message.error('Error: ' + err.message);
        }
      }    
}
          
  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}> 
                <Flex gap={'small'}>
                    <Text style={{fontSize:'20px',textTransform:'capitalize',color:'red',fontWeight:'normal'}} className='PoppinsFont'>{contactData.firstname ?contactData.firstname : 'Profile Name'} - Contact</Text>
                </Flex>

                <Flex gap={'small'}>
                   {selectRowKey.length > 0 && <Button type='primary' onClick={dealDelete}>Delete</Button>}
                    <Button type='primary' id='themeColor'>
                        <a href={`mailto:${contactData.email}`} onClick={()=>makeMail(contactData.email)}>Send Email</a>
                    </Button>

                    <Dropdown menu={{items}} placement='bottomCenter'>
                        <Button type='primary' id='themeColor'>Convert</Button>
                    </Dropdown>
           
                    <Button type='default'>
                        <Link to={`/contact/contactDetail/contactEditForm/${id}`} >Edit contact</Link> 
                    </Button>
                    
                    <Button type='default'>
                        <Link to={'/contact'}>Back to Contact Board</Link> 
                    </Button>
                </Flex>
        </Row>
        <Row style={{minHeight:"80vh",maxHeight:'80vh',overflow:'auto'}} justify={'space-around'}>
          <Col span={3} style={{backgroundColor: 'white',borderRadius:'10px',minHeight:'100vh',maxHeight:'100vh',overflow:'auto'}}>
            <Link to={`/contact/dealForm/${id}`}><Button type='default'> create Deal </Button></Link>
          </Col>
          
          <Col span={20} offset={1} style={{overflow:'auto'}}>
          <Row style={{minHeight:"100vh",maxHeight:'100vh',overflow:'auto',width:'100%'}}>
              <Col span={24} style={{backgroundColor:'white',borderRadius:'10px'}}>
                  {Object.entries(contactData).map(([key, value])=>( 
                      <Row style={{padding:'10px'}} className='leadDetail'>
                          <Col span={3} style={{textAlign:'end',textTransform:'capitalize',mcolor:'darkblue'}} className='PoppinsFont'> {key} : </Col>
                          <Col span={20} style={{textAlign:'start',color:'grey',padding:'3px',overflow:'auto'}} offset={1} className='PoppinsFont'> {key.toLocaleLowerCase() === 'email' ? <Popconfirm title={'Are you sure to mail'} okText={'Mail'} cancelText={'No'}  onConfirm={() => makeMail(value)} onCancel={()=>message.error('Mail Canceled')}> <a> {value} </a> </Popconfirm>  : key.toLocaleLowerCase() === 'website' ? <a href={`${value}`} target='_blank' >{value}</a> : key.toLocaleLowerCase() === 'mobile' ?  <Popconfirm title={'Are you sure to call'} okText={'Call'} cancelText={'No'}  onConfirm={() => makeCall(value)} onCancel={()=>message.error('Canceled call')}> <a> {value} </a> </Popconfirm>  : value}</Col> 
                      </Row>
                  ))}
              </Col>

              <Col span={24}>
                <Calllogs callLogs={callLogs} emailLog={mailLog}/>
              </Col>
              <Col span={24}> 
                <InnerDeal id={id} setSelectedRowKey={setSelectedRowKey}/>
              </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default ContactDetail