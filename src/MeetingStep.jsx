import { Button, message, Row, Space, Steps } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'

// this is message ele from antd
function messageLoading(){  
  message.loading(`Processing`)
}

const stylesForPadding = {
  "padding" : '25px'
}

const MeetingStep = () => {
 const navigate = useNavigate()
 const [current,setCurrent] = useState(1)
 const onChange = (value) => {
    console.log('onChange:', value)
    setCurrent(value)
  };

  const userDetail = async()=>{
    const paramsData = {
      scope :'ZohoMeeting.manageOrg.READ',
      client_id :process.env.REACT_APP_CLIENT_ID,
      response_type:'code',
      redirect_uri :process.env.REACT_APP_REDIRECT_URI,
      access_type : 'offline'
    }
      window.location.href = `https://accounts.zoho.in/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&redirect_uri=${paramsData.redirect_uri}&access_type=${paramsData.access_type}`
  }

  const getAuthToken = ()=>{
    messageLoading()
    setTimeout(()=>{
      AuthorizationGrantCode()
    },[1 * 1000])
  }

  const AuthorizationGrantCode = async()=>{
    const paramsData = {
      scope :'ZohoMeeting.meeting.ALL',
      client_id :process.env.REACT_APP_CLIENT_ID,
      response_type:'code',
      redirect_uri :process.env.REACT_APP_REDIRECT_URI,
      access_type : 'offline'
    }
      window.location.href = `https://accounts.zoho.in/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&redirect_uri=${paramsData.redirect_uri}&access_type=${paramsData.access_type}`
  }

  return (
    <div>
          <Dashboard />
          <Row justify={'end'} style={{padding:'20px'}}>
            <Space>
              <Link to={`/contacts/meetingStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>
              <Link onClick={ () => window.history.back(-1)}><Button type='primary'>Back one Step</Button></Link>
            </Space>
          </Row>
          
          <Row style={{padding:'20px'}} justify={'center'}>  
            <Steps
              style={{width:'80%'}}
              size='default'
              current={current}
              onChange={onChange}
              items={[
                {
                 title : 'GET USER DETAIILS',
                 description:'In Zoho Meeting,your business is termed as an organization. A zsoid key has to be used for all other APIs.'

                },
                {
                 title : 'GET AN ACCESS TOKEN',
                 description:'All Zoho Meeting APIs need to be authenticated using an OAuth token.'
                },
                {
                 title : 'SCHEDULE MEETINGS',
                 description:'After getting the access token you can Schedule the meeting'
                }
              ]}
            /> 
          </Row>

          <Row justify={'center'} style={{padding : '30px'}}>
            <Space>
              <Button onClick={userDetail} style={stylesForPadding}>GET ZOHO USER TOKEN</Button>
              <Button onClick={getAuthToken} style={stylesForPadding} type='primary'>GET ZOHO MEETING TOKEN</Button>
            </Space>       
          </Row>

    </div>
  )
}

export default MeetingStep