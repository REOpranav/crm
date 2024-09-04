import { Button, message, Row, Space, Steps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


// this is message ele from antd
function messageLoading(){  
  message.loading(`We are arranging your meeting`)
}

const MeetingStep = () => {
 const navigate = useNavigate();
 const [current,setCurrent] = useState(1)
 const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
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
    },[2 * 1000])
  }

  const AuthorizationGrantCode = async()=>{
    const paramsData = {
      scope :'ZohoMeeting.meeting.CREATE',
      client_id :process.env.REACT_APP_CLIENT_ID,
      response_type:'code',
      redirect_uri :process.env.REACT_APP_REDIRECT_URI,
      access_type : 'offline'
    }
      window.location.href = `https://accounts.zoho.in/oauth/v2/auth?scope=${paramsData.scope}&client_id=${paramsData.client_id}&response_type=${paramsData.response_type}&redirect_uri=${paramsData.redirect_uri}&access_type=${paramsData.access_type}`
  }


  return (
    <div>
          <Row style={{padding:'5px'}} justify={'center'}>  
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

          <Row justify={'center'}>
            <Space>
              <Button onClick={userDetail}>GET ZOHO USER TOKEN</Button>
              <Button onClick={getAuthToken} type='primary'>GET ZOHO MEETING TOKEN</Button>
              {/* <Link to={`./ScheduleMeeting`}> <Button type='primary'>SCHEDULE MEETING</Button> </Link>   */}
            </Space>       
          </Row>

    </div>
  )
}

export default MeetingStep