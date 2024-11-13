import { Button, Col, message, Row, Space, Steps, Typography } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import './MeetingDetail.css'
import { getZohoAuth_Code } from 'api-auth-zoho'

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
  const fetchZOHOmeetingUserDetail = () => { // this code for getting org id
    const scope = 'ZohoMeeting.manageOrg.READ'
    const client_id = process.env.REACT_APP_MAIL_CLIENT_ID
    const redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI

    getZohoAuth_Code(scope, client_id, redirect_uri)
  }

  const fetchZOHOmeetingAccessToken = () => {
    messageLoading()
    setTimeout(() => {
      GetZOHO_MeetingAccessToken()
    }, [1 * 1000])
  }

  const GetZOHO_MeetingAccessToken = () => { // this code for getting access token
    const scope = 'ZohoMeeting.meeting.ALL'
    const client_id = process.env.REACT_APP_MAIL_CLIENT_ID
    const redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI

    getZohoAuth_Code(scope, client_id, redirect_uri)
  }


  // ZOHO mail integration code
  const fetchZOHOMailAccountDetail = () => { // This is for getting mail account_id.
    const scope = 'ZohoMail.accounts.ALL'
    const client_id = process.env.REACT_APP_MAIL_CLIENT_ID
    const redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI

    getZohoAuth_Code(scope, client_id, redirect_uri)
  }

  // This is ZOHO mail integration code
  const fetchZOHOMailFolders = () => { // This is for getting mail account_id. 
    const scope = 'ZohoMail.folders.ALL'
    const client_id = process.env.REACT_APP_MAIL_CLIENT_ID
    const redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI

    getZohoAuth_Code(scope, client_id, redirect_uri)
  }

  const fetchZOHOMailAccessToken = () => {
    messageLoading()
    setTimeout(() => {
      getZOHOmailMessageAccessToken()
    }, [1 * 1000])
  }

  // This for getting ZOHO mail access token
  const getZOHOmailMessageAccessToken = () => {
    const scope = 'ZohoMail.messages.ALL'
    const client_id = process.env.REACT_APP_MAIL_CLIENT_ID
    const redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI

    getZohoAuth_Code(scope, client_id, redirect_uri)
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
          <Row style={{ paddingTop: '5px' }} justify={"start"}>
            <span style={{ color: 'gray', fontStyle: 'italic', marginLeft: '15px' }}>Retrieve <span style={{ color: 'red', textTransform: 'capitalize' }}> all </span> tokens for integration</span>
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
                  title: 'GET MAIL ACCOUNT',
                  description: 'An organization-specific key is required for accessing various APIs.'
                },
                {
                  title: 'GET MAIL FOLDER TOKEN',
                  description: 'All APIs require authentication using an OAuth token.'
                },
                {
                  title: 'GET MAIL MESSAGE ACCESS TOKEN',
                  description: 'After obtaining the access token, you can schedule the event.'
                }

              ]}
            />
          </Row>

          <Row justify={'space-evenly'} style={{ padding: '30px' }}>
            <Button onClick={fetchZOHOMailAccountDetail} style={stylesForPadding}>GET ZOHO <span style={{ color: 'red' }}> MAIL ACCOUNT ACCESS</span>TOKEN </Button>
            <Button onClick={fetchZOHOMailFolders} style={stylesForPadding}>GET ZOHO <span style={{ color: 'red' }}> MAIL FOLDER ACCESS</span>TOKEN</Button>
            <Button onClick={fetchZOHOMailAccessToken} style={stylesForPadding}>GET ZOHO <span style={{ color: 'red' }}>MAIL MESSAGE ACCESS </span>TOKEN</Button>
          </Row>
        </>
      }

    </div>
  )
}

export default MeetingStep