import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Col, Image, message, Popconfirm, Row, Space, Tooltip, Typography } from 'antd'
import axios from 'axios'
import { json, Link, useNavigate } from 'react-router-dom'
import './MailLog.css'
import { CiMail } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";

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

const MailLog = () => {
  const navigate = useNavigate();
  const { Title } = Typography

  // // accessing the zoho Mail Account detail from session storage
  const ZOHOmailAccountdDetail = sessionStorage.getItem('mailAccountdDetail') || []
  const ZOHOmailFolderNumber = sessionStorage.getItem('mailFolderDetail') || []
  const totalMailDatas = sessionStorage.getItem('totalMailDatas') || []
  const ZOHOmailAccountDetailResponceAccountName = sessionStorage.getItem('ZOHOmailAccountDetailResponceAccountName') || []
  const ZOHOmailAccountDetailResponcePrimaryEmailAddress = sessionStorage.getItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress') || []

  // this is for parsing the all JSON data to normal data
  const parsingFunction = (data)=>{
    return data.length > 0 ? JSON.parse(data) : ""
  }

  // this code are ZOHO MAIL intregreation codes 
  const fetchedDataFromZOHOmailFOlder = (token) => { // if account Token will get ,stored in session storage
    sessionStorage.setItem('mailFolderDetail', JSON.stringify(token)) // stroing the api data in sessiong storage
    const checkmailAccountdDetailForDropMessage = JSON.parse(sessionStorage.getItem('mailFolderDetail')) || [] //checking if there have meetingAccessTokenData in session storage for showing the success message
    checkmailAccountdDetailForDropMessage !== null ? message.success('Mail Folder Detail Retrieved') : message.warning('Failed to retrive,Pleace Retry the same process')
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const getZOHOmailAccountIDdetail = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
      ZOHOmailAccountdNumber: ZOHOmailAccountdDetail,
      ZOHOmailFolderNumber: ZOHOmailFolderNumber
    }

    try {
      const ZOHOmailAccountDetailResponce = await axios.post(`http://localhost:3002/api/mailAccountToken`, accessTokenParams) // this line send the request to node (server.js)
      
      // sessionStorage.setItem('totalMailDatas', JSON.stringify(ZOHOmailAccountDetailResponce?.data?.data)) // this code is accesstoken relevent code

      if (ZOHOmailAccountDetailResponce.data) {
             sessionStorage.setItem('mailAccountdDetail', JSON.stringify(ZOHOmailAccountDetailResponce.data.data[0].accountId))
             sessionStorage.setItem('ZOHOmailAccountDetailResponceAccountName', JSON.stringify(ZOHOmailAccountDetailResponce.data.data[0].accountName))
             sessionStorage.setItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress', JSON.stringify(ZOHOmailAccountDetailResponce.data.data[0].primaryEmailAddress))
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

    try {
      const accessTokenResponce = await axios.post(`http://localhost:3002/api/ZOHOmailMessageAccessToken`, accessTokenParams) // this line send the request to node (server.js)       
      console.log(accessTokenResponce.data);
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

  // showing the date for zoho mail
  const showingDateInZOHOmail = (millisecound) => {
    const timestampInSeconds = millisecound / 1000;
    const dateObject = new Date(timestampInSeconds);
  
    // Get the user's preferred time zone
    const userTimeZoneOffset = dateObject.getTimezoneOffset() * 60 * 1000;
    const timestampInUserTimeZone = millisecound - userTimeZoneOffset;
  
    const formattedDate = new Date(timestampInUserTimeZone).toLocaleString("en-US", {
      year: 'numeric',  // Full year (2024)
      month: 'short',  // Short month name (Oct)
      day: 'numeric',  // Day of the month (23)
      hour: 'numeric',  // Hour (11)
      minute: '2-digit', // Padded minutes (32)
      second: '2-digit', // Padded seconds (01)
      hour12: true,    // Use 12-hour clock (AM/PM)
    })
    return formattedDate
  }

  // this is for back one step
  const back = () => {
    window.history.back()
  }

  // this useeffect for load the access token function when code is available in url 
  useEffect(() => {
    if (Authcode !== null) {
      getZOHOmailAccountIDdetail()
    }
  }, [undefined])

  useEffect(() => {
    if (Authcode !== null) {
      // ZOHOmailFolderDetail()
    }
  }, [undefined])

  useEffect(() => {
    if (Authcode !== null) {
      // getZOHOmailMessageAccessToken()
    }
  }, [undefined])

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} >
        <Space style={{ paddingLeft: '10px' }}>
          <Title level={3} style={{ fontWeight: 'lighter', color: 'red' }}> Mail Log <span style={{color:'gray',fontSize:'small',fontWeight:'400',fontStyle:'italic'}}>{`${parsingFunction(ZOHOmailAccountDetailResponcePrimaryEmailAddress) ?? ''}`}</span></Title>
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
      <Row style={{ minHeight: "65vh", maxHeight: '65vh', overflow: 'auto', marginTop: '20px' }} justify={'center'}>
        <Col span={23}>
          {parsingFunction(totalMailDatas) && parsingFunction(totalMailDatas).map((data) => {
            return <Row className='mailDataStyle'>
              <Col span={1}><CiMail className='ZOHOmailLOGO'/></Col>
              <Col span={5} className='mailDataFromAddress'><Row style={{ maxWidth: '90%' }} className='mailDataFromAddress'>{data.fromAddress}</Row></Col>
              <Col span={17}><Row justify={'center'}> <Col span={23} className='mailDataSummuryStyle'>{data.subject}</Col></Row></Col>
              <Col span={1} style={{ textAlign: 'end' }}><MdOutlineDeleteOutline className='ZOHOmailDelete' /></Col>
            </Row>
          })}
        </Col>
      </Row>
    </div>
  )
}

export default MailLog