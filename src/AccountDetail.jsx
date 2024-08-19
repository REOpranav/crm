import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Flex, Row,Typography,Button,Col, Dropdown,message, Popconfirm} from 'antd'
import Calllogs from './Calllogs'
import axios from 'axios'
import { Link } from 'react-router-dom'
import moment from 'moment'

const AccountDetail = () => {
    const {Text} = Typography
    const [accountData,setAccountData] = useState([])
    const [mailLog,setMailLogs] = useState('')
    const [callLogs,setCallLogs] = useState('')

    const URL = window.location.href
    const id = URL.split('/').pop()    

    // this code for initial load and when lead added
        const fetching = async()=>{
            try {
                const responce = await axios.get(`http://localhost:3000/account/${id}`)         
                  if (responce.status === 200) {
                    setAccountData(await responce.data)
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

        const items = [
            {
                key: '1',
                label: (<Link to={''}>Convert to Account</Link> ),
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
                    if (posting.status == 201) {
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

  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}> 
                <Flex gap={'small'}>
                    <Text style={{fontSize:'20px',textTransform:'capitalize',color:'red',fontWeight:'lighter'}} >{accountData.firstname ? accountData.firstname : 'Profile Name'} - Account</Text>
                </Flex>

                <Flex gap={'small'}>
                    <Button type='primary' id='themeColor'>
                        <a href={`mailto:${accountData.email}`} onClick={()=>makeMail(accountData.email)}>Send Email</a>
                    </Button>

                    <Dropdown menu={{items}} placement='bottomCenter'>
                        <Button type='primary' id='themeColor'>Convert</Button>
                    </Dropdown>
           
                    <Button type='default'>
                        <Link to={`/account/accountDetail/accountEditForm/${id}`} >Edit Account</Link> 
                    </Button>
                    
                    <Button type='default'>
                        <Link to={'/contact'}>Back to Contact Board</Link> 
                    </Button>
                </Flex>
        </Row>
        <Row style={{minHeight:"80vh",maxHeight:'80vh',overflow:'auto'}} justify={'space-around'}>
          <Col span={3} style={{backgroundColor: 'white',borderRadius:'10px',minHeight:'100vh',maxHeight:'100vh',overflow:'auto'}}>
              <Button type='dashed' className='PoppinsFont'>call log</Button> 
          </Col>
          
          <Col span={20} offset={1} style={{overflow:'auto'}}>
          <Row style={{minHeight:"100vh",maxHeight:'100vh',overflow:'auto',width:'100%'}}>
              <Col span={24} style={{backgroundColor:'white',borderRadius:'10px'}}>
                  {Object.entries(accountData).map(([key, value])=>( 
                      <Row style={{padding:'10px'}} className='leadDetail'>
                          <Col span={3} style={{textAlign:'end',textTransform:'capitalize',mcolor:'darkblue'}} className='PoppinsFont'> {key} : </Col>
                          <Col span={20} style={{textAlign:'start',color:'grey',padding:'3px',overflow:'auto'}} offset={1} className='PoppinsFont'> {key.toLocaleLowerCase() === 'email' ? <Popconfirm title={'Are you sure to mail'} okText={'Mail'} cancelText={'No'}  onConfirm={() => makeMail(value)} onCancel={()=>message.error('Mail Canceled')}> <a> {value} </a> </Popconfirm>  : key.toLocaleLowerCase() === 'website' ? <a href={`${value}`} target='_blank' >{value}</a> : key.toLocaleLowerCase() === 'mobile' ?  <Popconfirm title={'Are you sure to call'} okText={'Call'} cancelText={'No'}  onConfirm={() => makeCall(value)} onCancel={()=>message.error('Canceled call')}> <a> {value} </a> </Popconfirm>  : value}</Col> 
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

export default AccountDetail