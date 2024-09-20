import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Flex, Row,Typography,Button,Col, Dropdown,message, Popconfirm} from 'antd'
import Calllogs from './Calllogs'
import axios from 'axios'
import { Link } from 'react-router-dom'
import moment from 'moment'
import InnerDeal from './InnerDeal'

const AccountDetail = () => {
    const {Text} = Typography
    const [accountData,setAccountData] = useState([])
    const [mailLog,setMailLogs] = useState('')
    const [callLogs,setCallLogs] = useState('')
    const [selectRowKey,setSelectedRowKey] = useState('')
    const [deleteInnerDealRow,setDeleteInnerDealRow] = useState(false)
    const [loadTime,setLoadTime] = useState(false)

    // this is get the id from URL
    const URL = window.location.href
    const id = URL.split('/').pop()  

    // this code for initial load and when lead added
        const fetching = async()=>{
            try {
                const responce = await axios.get(`http://localhost:3000/accounts/${id}`)         
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
                    message.error('Error: No response from server.');
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
                  message.error('Error: No response from server.');
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
    setLoadTime(true)
    try {
      const URL = `http://localhost:3000/deals`
      let deleting ;
        for (const deleteValue of selectRowKey) {
          deleting = await axios.delete(`${URL}/${deleteValue}`)        
        }
        if (deleting.status === 200) {
          message.success("sucessfully Deleted the data")
        }
        setSelectedRowKey(0)
      } catch (err) {
        if (err.response) {
              message.error('Error: ' + err.response.status+' - '+ (err.response.data.message || 'Server Error'));
        } else if (err.request) {
              message.error('Error: No response from server.');
        } else {
              message.error('Error: ' + err.message);
        }
      }
      setLoadTime(false)
  }
 
  // intial fetch
  useEffect(()=>{
    fetching()
  },[undefined])

  // // this is for drop down (antd frameworks)
  //   const items = [
  //       {
  //           key: '1',
  //           label: (<Link to={`/accounts/dealForm/${id}`}>Convert to Deal</Link>),
  //       }
  //   ]

  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}> 
                <Flex gap={'small'}>
                    <Text style={{fontSize:'20px',textTransform:'capitalize',color:'red',fontWeight:'lighter'}} >{accountData.accountOwner ? accountData.accountOwner : 'Profile Name'} - Account</Text>
                </Flex>

                <Flex gap={'small'}>
                    {selectRowKey.length > 0 && <Button type='primary' onClick={dealDelete}>Delete</Button>}
                    
                    <Button type='primary' id='themeColor'>
                        <a href={`mailto:${accountData.email}`} onClick={()=>makeMail(accountData.email)}>Send Email</a>
                    </Button>

                    {/* <Dropdown menu={{items}} placement='bottomCenter'> */}
                    <Link to={`/accounts/dealForm/${id}`}> <Button type='primary' id='themeColor'>Create Deal</Button> </Link>
                    {/* </Dropdown> */}
           
                    <Button type='default'>
                        <Link to={`/accounts/accountDetail/accountEditForm/${id}`} >Edit Account</Link> 
                    </Button>
                    
                    <Button type='default'>
                        <Link to={'/contacts'}>Back to Account Board</Link> 
                    </Button>
                </Flex>
        </Row>
        <Row style={{minHeight:"80vh",maxHeight:'80vh',overflow:'auto'}} justify={'space-around'}>
          <Col span={3} style={{backgroundColor: 'white',borderRadius:'10px',minHeight:'100vh',maxHeight:'100vh',overflow:'auto'}}>
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
              <Col span={24}> 
                <InnerDeal id={id} setSelectedRowKey={setSelectedRowKey} deleteInnerDealRow={deleteInnerDealRow} setDeleteInnerDealRow={setDeleteInnerDealRow} loadTime={loadTime}/>
              </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default AccountDetail