import React, { useState ,useEffect} from 'react'
import {Button, message,notification, Row, Title, Typography, Menu, Flex,Space,Layout,Col,Dropdown, Popconfirm} from  'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Detail.css'
import Dashboard from './Dashboard'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Calllogs from './Calllogs'

const backGroundColor = '#313949'

// this is message ele from antd
function messageSuccess(){
    message.success('Sucessfully Transfer to Contact')
}

const Detail = () => {
    const [leadData,setLeadData] = useState([])
    const {Text} = Typography // antd
    const [callLogs,setCallLogs] = useState('')
    const [mailLog,setMailLogs] = useState('')
    const navigation = useNavigate() //this is for navigation

    const URL = window.location.href
    const id = URL.split('/').pop()

    // this code for initial load and when lead added
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/leads/${id}`)         
                if (responce.status === 200) {
                    setLeadData(await responce.data)
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
      },[undefined])
      
      const converToContact = async()=>{ 
            let dataFromLead = await axios.get(`http://localhost:3000/leads/${id}`) // first getting the particular id
            await axios.post('http://localhost:3000/contact',dataFromLead.data) // secound post that contact form
              .then(res => {
                if (res.status === 201) {
                  messageSuccess();
                }
                axios.delete(`http://localhost:3000/leads/${id}`) // third code for deleting data in lead

                setTimeout(()=>{
                    navigate()
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

    // this is simple change lead to contact/account/deal (line number 143)
    const items = [
        {
          key: '1',
          label: (<Link onClick={converToContact}> Convert to Contact </Link> ),
        },
        {
            key: '2',
            label: (<Link to={'/account'}> Convert to Account </Link> ),
        },
        {
            key: '3',
            label: ( <Link to={'/deal'}> Convert to Deal </Link>),
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
                  const URL = `http://localhost:3000/logs`
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
      
    // this for navigation
    function navigate() {
        navigation('/contact')
    }

    return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}> 
                <Flex gap={'small'}>
                    <Text style={{fontSize:'20px',textTransform:'capitalize',color:'red',fontWeight:'lighter'}}>{leadData.firstname ?leadData.firstname : 'Profile Name'} - lead</Text>
                </Flex>

                <Flex gap={'small'}>
                    <Button type='primary'>
                        <a href={`mailto:${leadData.email}`}>Send Email</a>
                    </Button>

                    <Dropdown menu={{items}} placement='bottomCenter'>
                        <Button type='primary'>Convert</Button>
                    </Dropdown>
           
                    <Button type='default'>
                        <Link to={`/leads/detail/leadeditform/${id}`}>Edit Lead</Link> 
                    </Button>
                    
                    <Button type='default'>
                        <Link to={'/leads'}>Back to Lead Board</Link> 
                    </Button>
                </Flex>
        </Row>
      
      <Row style={{minHeight:"80vh",maxHeight:'80vh',overflow:'auto'}} justify={'space-around'}>
          <Col span={3} style={{backgroundColor:'white',borderRadius:'10px',minHeight:'100vh',maxHeight:'100vh',overflow:'auto'}}>
              <Button type='primary'>call log</Button> 
          </Col>

          <Col span={20} offset={1} style={{overflow:'auto'}}>
            <Row style={{minHeight:"100vh",maxHeight:'100vh',overflow:'auto',width:'100%'}}>
                <Col span={24} style={{backgroundColor:'white',borderRadius:'10px'}}>
                    {Object.entries(leadData).map(([key, value])=>( 
                        <Row style={{padding:'10px'}} className='leadDetail'>
                            <Col span={3} style={{textAlign:'end',textTransform:'capitalize',mcolor:'darkblue'}}> {key} : </Col>
                            <Col span={20} style={{textAlign:'start',color:'grey',padding:'3px',overflow:'auto'}} offset={1}> {key.toLocaleLowerCase() === 'email' ? <Popconfirm title={'Are you sure to mail'} okText={'Mail'} cancelText={'No'}  onConfirm={() => makeMail(value)} onCancel={()=>message.error('Mail Canceled')}> <a> {value} </a> </Popconfirm> : key.toLocaleLowerCase() == 'website' ? <a href={`${value}`} target='_blank' >{value}</a> : key.toLocaleLowerCase() === 'mobile' ?  <Popconfirm title={'Are you sure to call'} okText={'Call'} cancelText={'No'}  onConfirm={() => makeCall(value)} onCancel={()=>message.error('Call Canceled')}> <a> {value} </a> </Popconfirm>  : value}</Col> 
                        </Row>
                    ))}
                </Col> 
                <Col span={24}>
                    <Calllogs callLogs={callLogs} emailLog={mailLog}/>
                </Col>
            </Row>
        </Col>
      </Row>
        
    </div>
  )
}

export default Detail