import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Col, Image, message, Popconfirm, Row, Space, Tooltip, Typography } from 'antd'
import './MeetingDetail.css'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import { CiGlobe } from "react-icons/ci";
import { getZohoAuth_Code } from 'api-auth-zoho'

// this is for finding the name fron pathname to send  post request in that URL
const URL = window.location.pathname
const id = URL.split('/').pop()

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

// this is head style
const headingStyle = {
  padding: '5px',
  border: '1px solid '
}

// this is list css 
const listStyle = {
  boxShadow: '0 1px 5px grey',
  outline: 'none',
  padding: '10px',
  borderRadius: '5px',
  marginTop: '10px',
  display: 'flex',
  alignItems: 'center'

}

const listDataStyle = {
  textAlign: 'center'
}

const MeetingDetail = () => {
  const { Title } = Typography
  const [upcoming, setUpcoming] = useState(true)
  const [past, setPast] = useState(false)
  const [meetingList, setMeetingList] = useState([])
  const [isload, setISLoad] = useState(false)

  // this both array is storing the data which is seperted by date  
  const upcomingData = []
  const pastData = []

  // accessing rhe access tokena and user detail from session storage
  const meetingAccessTokenData = sessionStorage.getItem('ZOHOmailMessageAccessToken') ?? []
  const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail')) ?? []

  // this is for showing upcoming and past detail
  const upcomingOnclick = () => {
    setPast(false)
    setUpcoming(true)
  }

  const setPastOnclick = () => {
    setUpcoming(false)
    setPast(true)
  }

  // this function is get the meeting list
  const currentZOHOmeetingSchedule = () => {
    if (!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData)) {
      const MeetingCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "zsoid": meetingUserDetail ? meetingUserDetail?.zsoid : 0,
            "access_token": `${meetingAccessTokenData}`,
          }
        }
        try {
          const meetingListResponce = await axios.post(`https://crm-server-opal.vercel.app/api/list`, extras)// this line send the request to node (server.js)      
          if (meetingListResponce?.status == 200) {
            setMeetingList(meetingListResponce?.data)
          }
        } catch (err) {
          if (err.message == "Request failed with status code 500") {
            messageDrop('warning', 'Token Expired. Re-Generate the Tokens')
          }
        }
      }
      MeetingCredencial()
    }
  }

  // checking if the userdetail and accesstoken is available or not.if available ,then only this useeffect will run
  useEffect(() => {
    if (!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData)) { currentZOHOmeetingSchedule() }
  }, [undefined])

  // this call the currentZOHOmeetingSchedule function when isLoad is true   
  useEffect(() => {
    if (isload) {
      currentZOHOmeetingSchedule()
    }
  })

  // this is seperation code (past and upcoming meeting)  
  if (meetingList) {
    const listData = meetingList.session || []
    listData.map((data) => {
      if (moment(data?.startTime, 'MMM D, YYYY hh:mm A').isAfter(moment())) {
        upcomingData.push(data)
      } else {
        pastData.push(data)
      }
    })
  }

  // this is for deleting the meeting in database
  const meetingDeletetion = async (details) => {
    try {
      const data = {
        "session": {
          "zsoid": await meetingUserDetail.userDetails.zsoid,
          "meetingKey": await details, //sending the meeting key
          "accessToken": await meetingAccessTokenData.access_token
        }
      }
      setISLoad(true)
      const accessTokenResponce = await axios.post(`https://crm-server-opal.vercel.app/api/meeting/delete`, data)
      setISLoad(false)
    } catch (err) {
      setISLoad(false)
    }
  }

  // this is for showing the images for correct time
  const timingLogo = (date, time) => {
    const timeString = `${date}` + ` ${time}`
    const hours = moment(timeString, 'ddd, D MMM hh:mm A')
    const hourNumber = hours.hour()

    if (hourNumber >= 5 && hourNumber < 10) {
      return 'https://static.zohocdn.com/meeting/images/new-morning.2cc095d040bfeea581c02923101e8619.svg';
    } else if (hourNumber >= 10 && hourNumber < 15) {
      return 'https://static.zohocdn.com/meeting/images/new-afternoon.20479ae4ee0c4369b5cdc3996807ffbf.svg';
    } else if (hourNumber >= 15 && hourNumber < 18) {
      return 'https://static.zohocdn.com/meeting/images/new-evening.dfef6db090d8295d414d9169fb73e2b0.svg';
    } else {
      return 'https://static.zohocdn.com/meeting/images/new-night.97fae2422b330bca087a14708233bf1b.svg';
    }
  }

  // this is for back one step
  const back = () => {
    window.history.back()
  }


  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} >
        <Space style={{ paddingLeft: '10px' }}>
          <Title level={3} style={{ fontWeight: 'lighter', color: 'red' }}> Meeting log <span style={{ color: 'gray', fontSize: 'small', fontWeight: '400', fontStyle: 'italic' }}>{meetingUserDetail && meetingUserDetail?.userDetails?.primaryEmail}</span></Title>
        </Space>
        <Space style={{ marginRight: '10px' }}>
          <Link to={'/ScheduleMeeting'}><Button type='primary' style={{ width: '305px' }}>Create Meeting</Button></Link>
        </Space>

      </Row>
      <Row justify={'space-between'} style={{ backgroundColor: 'transparent', outline: 'none' }}>
        <Col>
          <Row className='meetingState'>
            <Col className='headstyle' onClick={upcomingOnclick} style={{ color: upcoming ? 'white' : 'black', backgroundColor: upcoming ? '#5a3bb6' : 'transparent', padding: '5px', width: '100px' }}> <span >Upcoming</span> </Col>
            <Col className='headstyle' onClick={setPastOnclick} style={{ color: past ? 'white' : 'black', backgroundColor: past ? '#5a3bb6' : 'transparent', padding: '5px', width: '100px' }}><span > Past </span> </Col>
          </Row>
        </Col>
        <Col style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
          <Space>
            <Link to={`/integrationStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>
            <Button type='primary' onClick={back}>Back one Step</Button>
          </Space>
        </Col>
      </Row>

      <Row style={{ minHeight: "65vh", maxHeight: '65vh', overflow: 'auto', marginTop: '20px' }} justify={'center'}>
        {upcoming &&
          <Col span={23}>
            {!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData) ? <>
              {upcomingData.length <= 0 && <Row justify={'center'} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <Col>
                  <Row justify={'center'}> <Image src='https://static.zohocdn.com/meeting/images/no-upcoming-meeting.08995d6de11131e73a5d7d0738f7ae39.svg' height={'150px'} preview={false} /> </Row>
                  <Row justify={'center'}> <Col> <Row justify={'center'} className='no-meeting-message-style'> No Upcoming Meetings.</Row> <Row justify={'center'} className='no-meeting-message-style'> You can either start an instant meeting or schedule a meeting </Row></Col> </Row>
                </Col>
              </Row>}

              {upcomingData && upcomingData.map((data) => {
                return <Row style={listStyle} className='listStyle'>
                  <Col span={4} style={listDataStyle} className='listDataStyle'>
                    <Row style={{ display: 'flex', alignItems: 'center' }} justify={'space-around'}>
                      <Col span={4}>
                        <span
                          style={{
                            backgroundImage: `url(${timingLogo(data.sDate, data.sTime)})`,
                            width: '30px',
                            height: '30px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'inline-block',
                          }}
                        ></span>
                      </Col>
                      <Col span={19} offset={1}> <Row justify={'center'}> {data.sDate} </Row> <Row justify={'center'}> <Col style={{ backgroundColor: 'GreenYellow', padding: '4px' }}> {data.sTime} </Col> <Col style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}> <Tooltip placement="bottomLeft" title={`${data.timezone}`} color='#5a3bb6'> <CiGlobe /> </Tooltip> </Col> </Row></Col>
                    </Row>
                  </Col>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>{data.topic}</Col>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>{data.presenterEmail}</Col>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>{data.durationInHours}</Col>
                  {/* <Col span={4} style={listDataStyle} className='listDataStyle'> <Link> START MEETING </Link> </Col> */}
                  <Col span={1}>
                    <Row justify={'center'}>
                      <Space size={'large'}>
                        {/* <Col><Link className='listDataStyle' to={`/editing/ScheduleMeeting/`}>Edit</Link></Col> */}
                        <Col><Link style={{ color: 'red' }} className='listDataStyle'> <Popconfirm title={'Are you sure to delete this meeting'} okText={'Delete Meeting'} cancelText={'No'} onConfirm={() => meetingDeletetion(data.meetingKey)} onCancel={() => messageDrop('info', 'Deletion canceled. Everything stays as is!')}> Cancel </Popconfirm> </Link> </Col>
                      </Space>
                    </Row>
                  </Col>
                </Row>
              })}
            </> : <>
              <Col style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>
                  <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/social/marketing-agencies/banner.png' height={'200px'} preview={false} style={{ opacity: '0.7' }} /> </Row>
                  <Row justify={'center'}> <Title level={4}><span style={{ color: '#5a3bb6' }}> <Button onClick={fetchZOHOMailAccountDetail}><span style={{ color: 'red' }}> INTEGRATE ZOHO MEETING</span></Button> </span></Title> </Row>
                  {/* <Row> <Title level={4}> Token <span style={{ color: 'orange' }}> expired </span>. Click the <span style={{ color: '#5a3bb6' }}>Re-Generate Tokens </span> button to generate new tokens.</Title></Row> */}
                  {/* {Array.isArray(meetingUserDetail) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho User </span> Token </Row>} */}
                  {/* {Array.isArray(meetingAccessTokenData) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Meeting Access </span> Token </Row>} */}
                </span>
              </Col>
            </>}
          </Col>
        }
        {past &&
          <Col span={23}>
            {!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData) ? <>
              {pastData.length <= 0 && <Row justify={'center'} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <Col >
                  <Row justify={'center'}> <Image src='https://static.zohocdn.com/meeting/images/no-upcoming-meeting.08995d6de11131e73a5d7d0738f7ae39.svg' height={'150px'} preview={false} /> </Row>
                  <Row justify={'center'}> <Col> <Row justify={'center'} className='no-meeting-message-style'> No Past Meetings.</Row> <Row justify={'center'} className='no-meeting-message-style'>You can either start an instant meeting or schedule a meeting </Row></Col> </Row>

                </Col>
              </Row>}
              {pastData && pastData.map((data) => {
                return <Row style={listStyle} className='listStyle'>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>
                    <Row style={{ display: 'flex', alignItems: 'center' }} justify={'space-between'}>
                      <Col>
                        <span
                          style={{
                            backgroundImage: `url(${timingLogo(data.sDate, data.sTime)})`,
                            width: '30px',
                            height: '30px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'inline-block',
                          }}
                        ></span>
                      </Col>
                      <Col span={19}> <Row justify={'space-evenly'} style={{ display: 'flex', alignItems: 'center' }}> {data.sDate} <span style={{ backgroundColor: 'orange', padding: '4px' }}> {data.sTime} </span> <span> <Tooltip placement="bottomLeft" title={`${data.timezone}`} color='#5a3bb6'> <CiGlobe /> </Tooltip> </span> </Row></Col>
                    </Row>
                  </Col>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>{data.topic}</Col>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>{data.presenterEmail}</Col>
                  <Col span={6} style={listDataStyle} className='listDataStyle'>{data.durationInHours}</Col>
                  <Col span={0} style={listDataStyle} className='listDataStyle'>
                    <Row justify={'space-around'}>
                      {/* <Col style={{color:'red'}}>View</Col> */}
                    </Row>
                  </Col>
                </Row>
              })}
            </> : <>
              <Col style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>
                  <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/social/marketing-agencies/banner.png' height={'200px'} preview={false} style={{ opacity: '0.7' }} /> </Row>
                  <Row justify={'center'}> <Title level={4}><span style={{ color: '#5a3bb6' }}> <Button onClick={fetchZOHOMailAccountDetail}><span style={{ color: 'red' }}> INTEGRATE ZOHO MEETING</span></Button> </span></Title> </Row>
                  {/* <Row> <Title level={4}> Token <span style={{ color: 'orange' }}> expired </span>. Click the <span style={{ color: '#5a3bb6' }}>Re-Generate Tokens </span> button to generate new tokens.</Title></Row> */}
                  {/* {Array.isArray(meetingUserDetail) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho User </span> Token </Row>} */}
                  {/* {Array.isArray(meetingAccessTokenData) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Meeting Access </span> Token </Row>} */}
                </span>
              </Col>
            </>}
          </Col>
        }
      </Row>
    </div>
  )
}

export default MeetingDetail

// ZOHO mail integration code
const fetchZOHOMailAccountDetail = () => { // This is for getting mail account_id.
  const scope = 'ZohoMail.accounts.ALL,ZohoMail.folders.ALL,ZohoMail.messages.ALL,ZohoMeeting.manageOrg.READ,ZohoMeeting.meeting.ALL'
  const client_id = process.env.REACT_APP_MAIL_CLIENT_ID
  const redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI

  getZohoAuth_Code(scope, client_id, redirect_uri)
}