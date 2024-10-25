import { Button, Col, message, Row, Space, Steps, Typography } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import './MeetingDetail.css'

// this is message ele from antd
function messageLoading() {
  message.loading(`Processing`)
}

const stylesForPadding = {
  "padding": '20px'
}

const mailIntHead = {
  "padding": '10px',
  'borderRadius': '10px',
  'backgroundColor': 'rgb(239, 232, 255)'
}

const MeetingStep = () => {
  const { Text } = Typography
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0) // this state for setting the current state in documentation line number 87

  const [meetingInt, setMeetingInt] = useState(true)
  const [mailInt, setMailInt] = useState(false)

  const onChange = (value) => {
    setCurrent(value)
  };

  // this is for showing upcoming and past detail
  const ZOHOmeetingIntegration = () => {
    setMailInt(false)
    setMeetingInt(true)
  }

  const ZOHOmailIntegration = () => {
    setMeetingInt(false)
    setMailInt(true)
  }

  // this is zoho meeting integration code
  const fetchZOHOmeetingUserDetail = async () => { // this code for getting org id
    const paramsData = {
      scope: 'ZohoMeeting.manageOrg.READ',
      client_id: process.env.REACT_APP_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      access_type: 'offline'
    }
    window.location.href = `https://accounts.zoho.in/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&redirect_uri=${paramsData.redirect_uri}&access_type=${paramsData.access_type}`
  }

  const fetchZOHOmeetingAccessToken = () => {
    messageLoading()
    setTimeout(() => {
      GetZOHO_MeetingAccessToken()
    }, [1 * 1000])
  }

  const GetZOHO_MeetingAccessToken = async () => { // this code for getting access token
    const paramsData = {
      scope: 'ZohoMeeting.meeting.ALL',
      client_id: process.env.REACT_APP_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      access_type: 'offline'
    }
    window.location.href = `https://accounts.zoho.in/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&redirect_uri=${paramsData.redirect_uri}&access_type=${paramsData.access_type}`
  }


  // ZOHO mail integration code
  const fetchZOHOMailAccountDetail = async () => { // this is for getting mail account_id.
    const paramsData = {
      scope: 'ZohoMail.accounts.ALL',
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      access_type: 'offline'
    }
    window.location.href = `https://accounts.zoho.com/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&access_type=offline&redirect_uri=${paramsData.redirect_uri}`
 }

   // this is ZOHO mail integration code
   const fetchZOHOMailFolders = async () => { // this is for getting mail account_id.
    const paramsData = {
      scope: 'ZohoMail.folders.ALL',
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      access_type: 'offline'
    }
    window.location.href = `https://accounts.zoho.com/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&access_type=offline&redirect_uri=${paramsData.redirect_uri}`
 }

 const fetchZOHOMailAccessToken = () => {
  messageLoading()
  setTimeout(() => {
    getZOHOmailMessageAccessToken()
  }, [1 * 1000]) 
}

  // this for getting ZOHO mail access token
  const getZOHOmailMessageAccessToken = async () => { 
    const paramsData = {
      scope: 'ZohoMail.messages.ALL',
      client_id: process.env.REACT_APP_CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      access_type: 'offline'
    }
    window.location.href = `https://accounts.zoho.com/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&access_type=offline&redirect_uri=${paramsData.redirect_uri}`
  }

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} style={{ padding: '20px' }}>
        <Col>
          <Row className='meetingState'>
            <Col className='headstyle' onClick={ZOHOmeetingIntegration} style={{ color: meetingInt ? 'white' : 'black', backgroundColor: meetingInt ? '#5a3bb6' : 'transparent', padding: '5px', minWidth: '200px' }}> <span>Get Meeting Tokens</span> </Col>
            <Col className='headstyle' onClick={ZOHOmailIntegration} style={{ color: mailInt ? 'white' : 'black', backgroundColor: mailInt ? '#5a3bb6' : 'transparent', padding: '5px', minWidth: '200px' }}><span>Get Mail Tokens</span> </Col>
          </Row>
        </Col>

        <Col>
          <Space>
            <Link onClick={() => window.history.back(-1)}><Button type='default'>Back one Step</Button></Link>
          </Space>
        </Col>
      </Row>

      {meetingInt &&
        <>
          <Row justify={'center'}>
            <Col span={23} style={mailIntHead}>
              <Text style={{ fontSize: '20px', color: '#5a3bb6', fontWeight: 'lighter' }}>Zoho Meeting Integration Step</Text>
            </Col>
          </Row>
          <Row style={{ padding: '20px', marginTop: '30px' }} justify={'center'}>
            <Steps
              style={{ width: '80%', maxHeight: '100px' }}
              size='default'
              current={current}
              onChange={onChange}
              items={[
                {
                  title: 'GET USER DETAILS',
                  description: 'An organization-specific key is required for accessing various APIs.'
                },
                {
                  title: 'GET AN ACCESS TOKEN',
                  description: 'All APIs require authentication using an OAuth token.'
                },
                {
                  title: 'SCHEDULE',
                  description: 'After obtaining the access token, you can schedule the event.'
                }

              ]}
            />
          </Row>

          <Row justify={'center'} style={{ padding: '30px' }}>
            <Space>
              <Button onClick={fetchZOHOmeetingUserDetail} style={stylesForPadding}>GET USER TOKEN FOR ZOHO MEETING</Button>
              <Button onClick={fetchZOHOmeetingAccessToken} style={stylesForPadding} type='primary'>GET ACCESS TOKEN FOR ZOHO MEETING</Button>
            </Space>
          </Row>
        </>
      }

      {mailInt &&
        <>
          <Row justify={'center'}>
            <Col span={23} style={mailIntHead}>
              <Text style={{ fontSize: '20px', color: '#5a3bb6', fontWeight: 'lighter' }}>Zoho Mail Integration Step</Text>
            </Col>
          </Row>
          <Row style={{ padding: '20px', marginTop: '30px' }} justify={'center'}>
            <Steps
              style={{ width: '80%', maxHeight: '100px' }}
              size='default'
              current={current}
              onChange={onChange}
              items={[
                {
                  title: 'GET USER DETAILS',
                  description: 'An organization-specific key is required for accessing various APIs.'
                },
                {
                  title: 'GET AN ACCESS TOKEN',
                  description: 'All APIs require authentication using an OAuth token.'
                },
                {
                  title: 'SCHEDULE',
                  description: 'After obtaining the access token, you can schedule the event.'
                }

              ]}
            />
          </Row>

          <Row justify={'space-evenly'} style={{ padding: '30px'}}>
              <Button onClick={fetchZOHOMailAccountDetail} style={stylesForPadding}>GET <span style={{color:'red'}}> MAIL ACCOUNT  TOKEN </span>FOR ZOHO MAIL</Button>
              <Button onClick={fetchZOHOMailFolders} style={stylesForPadding}>GET <span style={{color:'red'}}>FOLDER TOKEN</span> FOR MAIL ACCOUNT</Button>
              <Button onClick={fetchZOHOMailAccessToken} style={stylesForPadding}>GET <span style={{color:'red'}}> ACCESS TOKEN </span>  FOR ZOHO MAIL</Button>
          </Row>
        </>
      }

    </div>
  )
}

export default MeetingStep