import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Col, Image, message, Popconfirm, Row, Space, Tooltip, Typography } from 'antd'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { LogarithmicScale } from 'chart.js'

// this is for finding the name fron pathname to send  post request in that URL
const URL = window.location.pathname
const id = URL.split('/').pop()

// this is for getting the code (query param) from URL
const urlSearch = new URLSearchParams(window.location.search)
const Authcode = urlSearch.get('code')

// this is message setup (ant design)
const messageDrop = (type, content) => {
  message.open({
    type: type,
    style: {
      padding: '20px',
    },
    content: content
  })
}

// this is list css 
const listStyle = {
  boxShadow: '0 2px 2px #ddd',
  outline: 'none',
  padding: '10px',
  borderRadius: '5px',
  marginTop: '10px',
  display: 'flex',
}

const MailLog = () => {
  const navigate = useNavigate();
  const { Title } = Typography

  // // accessing the zoho Mail Account detail from session storage
  const ZOHOmailAccountdDetail = JSON.parse(sessionStorage.getItem('mailAccountdDetail')) || []
  const ZOHOmailFolderNumber = JSON.parse(sessionStorage.getItem('mailFolderDetail')) || []

  // this code are ZOHO MAIL intregreation codes 
  const fetchedDataFromZOHOmailAccount_IDdetail = (token) => { // if account Token will get ,stored in session storage
    sessionStorage.setItem('mailAccountdDetail', JSON.stringify(token)) // stroing the api data in sessiong storage
    const checkmailAccountdDetailForDropMessage = JSON.parse(sessionStorage.getItem('mailAccountdDetail')) ?? [] //checking if there have meetingAccessTokenData in session storage for showing the success message
    checkmailAccountdDetailForDropMessage !== null ? message.success('Mail Account Detail Retrieved') : message.warning('Failed to retrive,Pleace Retry the same process')

    setTimeout(() => { // setting time for removing the sessionStorage data after 1 hour, because default limit time for zoho api are 1 hours
      sessionStorage.removeItem('mailAccountdDetail')
    }, 3000 * 1000);
  }

  const fetchedDataFromZOHOmailFOlder = (token) => { // if account Token will get ,stored in session storage
    sessionStorage.setItem('mailFolderDetail', JSON.stringify(token)) // stroing the api data in sessiong storage
    const checkmailAccountdDetailForDropMessage = JSON.parse(sessionStorage.getItem('mailFolderDetail')) ?? [] //checking if there have meetingAccessTokenData in session storage for showing the success message
    checkmailAccountdDetailForDropMessage !== null ? message.success('Mail Folder Detail Retrieved') : message.warning('Failed to retrive,Pleace Retry the same process')

    setTimeout(() => { // setting time for removing the sessionStorage data after 1 hour, because default limit time for zoho api are 1 hours
      sessionStorage.removeItem('mailAccountdDetail')
    }, 3000 * 1000);
  }





  // this function is getting the zoho mail Account detail (Account ID) 
  const getZOHOmailAccount_IDdetail = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
    }
    
    try {
      const accessTokenResponce = await axios.post(`http://localhost:3002/api/mailAccountToken`, accessTokenParams) // this line send the request to node (server.js)       
      console.log(accessTokenResponce.data);
      
      if (accessTokenResponce.data) {
        fetchedDataFromZOHOmailAccount_IDdetail(accessTokenResponce.data.data[0].accountId)
      }
      setTimeout(() => {
        navigate('/maillog') // this is for getting out of that section
      }, 100);
    } catch (err) {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const ZOHOmailFolderDetail = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
      ZOHOmailAccountdNumber: ZOHOmailAccountdDetail
    }
    try {
      const accessTokenResponce = await axios.post(`http://localhost:3002/api/mailFolder`, accessTokenParams) // this line send the request to node (server.js)             
      if (accessTokenResponce.data) {
        fetchedDataFromZOHOmailFOlder(accessTokenResponce.data.data[0].folderId)
      }
      setTimeout(() => {
        navigate('/maillog') // this is for getting out of that section
      }, 100);
    } catch (err) {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const getZOHOmailMessageAccessToken = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
      ZOHOmailAccountdNumber: ZOHOmailAccountdDetail,
      ZOHOmailFolderNumber: ZOHOmailFolderNumber
    }

    console.log(accessTokenParams);
    
    try {
      const accessTokenResponce = await axios.post(`http://localhost:3002/api/mailMessageAccessToken`, accessTokenParams) // this line send the request to node (server.js)       
      console.log(accessTokenResponce.data);
      
      if (accessTokenResponce.data) {
        fetchedDataFromZOHOmailAccount_IDdetail(accessTokenResponce.data.data[0].accountId)
      }
      setTimeout(() => {
        navigate('/maillog') // this is for getting out of that section
      }, 100);
    } catch (err) {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  }

  // this is for back one step
  const back = () => {
    window.history.back()
  }

  // this useeffect for load the access token function when code is available in url 
  useEffect(() => {
    if (Authcode !== null) {
      getZOHOmailAccount_IDdetail()
    }}, [undefined])

  useEffect(() => {
    if (Authcode !== null) {
      // ZOHOmailFolderDetail()
  }},[undefined])

  useEffect(()=>{
    if (Authcode !== null) {
      // getZOHOmailMessageAccessToken()
    }
  },[undefined])
  

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} >
        <Space style={{ paddingLeft: '10px' }}>
          <Title level={3} style={{ fontWeight: 'lighter', color: 'red' }}> Mail Log </Title>
        </Space>
        <Space style={{ marginRight: '10px' }}>
          <Link><Button type='primary' style={{ width: '305px' }}>Send mail</Button></Link>{/* we want to create a send mail code */}
        </Space>

      </Row>
      <Row justify={'end'} style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}>
        <Col style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
          <Space>
            {/* we want to Regenerate the token */}
            <Link to={`/integrationStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>
            <Button type='primary' onClick={back}>Back one Step</Button>
          </Space>
        </Col>
      </Row>

      {/* <Row style={{ minHeight: "65vh", maxHeight: '65vh', overflow: 'auto', marginTop: '20px' }} justify={'center'}>
        {upcoming &&
          <Col span={23}>
            {!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData) ? <>
              {upcomingData.length <= 0 && <Row justify={'center'} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <Col>
                  <Row justify={'center'}> <Image src='https://static.zohocdn.com/meeting/images/no-upcoming-meeting.08995d6de11131e73a5d7d0738f7ae39.svg' height={'150px'} preview={false} /> </Row>
                  <Row justify={'center'}> <Col> <Row justify={'center'} className='no-meeting-message-style'> No mails in inbox.</Row> <Row justify={'center'} className='no-meeting-message-style'>Waiting For upcoming Mail.</Row></Col> </Row>
                </Col>
              </Row>}

              {upcomingData && upcomingData.map((data) => {
                return <Row style={listStyle} className='listStyle'>
                  <Col span={1}>
                    <Row justify={'center'}>
                      <Space size={'large'}>
                        <Col><Link style={{ color: 'red' }} className='listDataStyle'> <Popconfirm title={'Are you sure to delete this meeting'} okText={'Delete Meeting'} cancelText={'No'} onConfirm={() => meetingDeletetion(data.meetingKey)} onCancel={() => messageDrop('info', 'Deletion canceled. Everything stays as is!')}> Cancel </Popconfirm> </Link> </Col>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              })}
            </> : <>
              <Col style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>
                  <Row justify={'center'}> <Image src='https://oweb.zohowebstatic.com/sites/oweb/images/zakya/images/zakya-error-page-bg-2x.webp' height={'250px'} preview={false} /> </Row>
                  <Row> <Title level={4}> Token <span style={{ color: 'orange' }}> expired </span>. Click the <span style={{ color: '#5a3bb6' }}>Re-Generate Tokens </span> button to generate new tokens.</Title></Row>
                  {Array.isArray(meetingUserDetail) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho User </span> Token </Row>}
                  {Array.isArray(meetingAccessTokenData) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Mail Access </span> Token </Row>}
                </span>
              </Col>
            </>}
          </Col>
        }
      </Row> */}
    </div>
  )
}

export default MailLog