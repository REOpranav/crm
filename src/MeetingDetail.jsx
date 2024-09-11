import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import {Button, Col, Image, message, Popconfirm, Row, Space ,Typography} from 'antd'
import './MeetingDetail.css'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'

// this is for finding the name fron pathname to send  post request in that URL
const URL = window.location.pathname    
const id = URL.split('/').pop()

// this is message setup (ant design)
const messageDrop = (type,content)=>{
    message.open({
      type : type,
      style : {
        padding : '20px', 
      },
      content : content
     })
  }

// this is head style
const headingStyle = {
    fontSize:'20px',
    padding:'5px',
}

// this is list css 
const listStyle = {
    boxShadow:'0 1px 5px grey',
    outline:'none',
    padding:'20px',
    borderRadius:'5px',
    marginTop:'10px',
    display:'flex',
    alignItems:'center'

}

const listDataStyle = {
  textAlign  : 'center'
}

const MeetingDetail = () => {
    const {Text,Title} = Typography
    const [upcoming,setUpcoming] = useState(true)
    const [past,setPast] = useState(false)
    const [meetingList,setMeetingList] = useState([])
    const [isload,setISLoad]  = useState(false)

    // this both array is storing the data which is seperted by date  
    const upcomingData = []
    const pastData = []

    // accessing rhe access tokena and user detail from session storage
    const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken'))
    const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail'))

    // this is for showing upcoming and past detail 
    const upcomingOnclick = ()=>{
      setPast(false)
      setUpcoming(true)
    }

    const setPastOnclick = ()=>{
      setUpcoming(false)
      setPast(true)
    }

    // this function is create meeting listing credencial
    const createMeetingCredencial = async()=>{
      const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
        "session" : {
            "zsoid": meetingUserDetail.userDetails.zsoid,
            "access_token": `${meetingAccessTokenData.access_token}`,
          }
        }
        try {
          const meetingListResponce = await axios.post(`http://localhost:3002/api/list`,extras)// this line send the request to node (server.js)      
            if (meetingListResponce.status == 200) {
              setMeetingList(meetingListResponce.data)
            }
          } catch (err) {
          if (err.message == "Request failed with status code 500") {
              messageDrop('warning','Token Expired. Re-Generate the Tokens')
          }
          console.log(err.code)
        }
    }

    // this is for initial load
    useEffect(()=>{
      createMeetingCredencial()
    },[undefined])
    
    useEffect(()=>{      
      if (isload) {
        createMeetingCredencial()
      }
    })

    if ( meetingList) {
      const listData = meetingList.session || []
      listData.map((data)=>{                      
        if (moment(data.startTime,'MMM D, YYYY hh:mm A').isAfter(moment())) {
          upcomingData.push(data)
        }else{
          pastData.push(data)
        }
      })  
    }
  
    // this is for deleting the meeting in database and meeting application
      const meetingDeletetion = async(details)=>{
        try {
          const data = {
            "session": {
              "zsoid":await meetingUserDetail.userDetails.zsoid,
              "meetingKey":await details, //sending the meeting key
              "accessToken":await meetingAccessTokenData.access_token
          }
        }
        setISLoad(true)
            const accessTokenResponce = await axios.post(`http://localhost:3002/api/meeting/delete`,data)
        setISLoad(false)
        } catch (err) {        
          console.log(err.message);
          setISLoad(false)
        }        
      }

    // this is for showing the images for correct time
      const timingLogo = (date,time)=>{
        const timeString = `${date}` + ` ${time}`
        const hours = moment(timeString, 'ddd, D MMM hh:mm A');
        const hourNumber = hours.hour() 

         if (hourNumber >= 5 && hourNumber < 10) {
          return 'https://static.zohocdn.com/meeting/images/new-morning.2cc095d040bfeea581c02923101e8619.svg';
        } else if (hourNumber >= 10 && hourNumber < 15) {
          return 'https://static.zohocdn.com/meeting/images/new-afternoon.20479ae4ee0c4369b5cdc3996807ffbf.svg';
        } else if (hourNumber >= 15 && hourNumber < 18) {
          return 'https://static.zohocdn.com/meeting/images/new-evening.dfef6db090d8295d414d9169fb73e2b0.svg';
        }else {
          return 'https://static.zohocdn.com/meeting/images/new-night.97fae2422b330bca087a14708233bf1b.svg';
        }
      }
    
  
  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{paddingLeft:'10px'}}>
          <Space>
              <Title level={3} style={{fontFamily:'monospace',fontWeight:'lighter'}}> Meeting </Title>
          </Space>  
        </Row>
        <Row justify={'start'} style={{backgroundColor:'transparent',boxShadow:'0px 0.3px 1px grey',outline:'none',border:'none'}}>
            <Col style={headingStyle} className='headstyle' onClick={upcomingOnclick}> <span style={{borderBottom:upcoming ? '3px solid Blue': 'transparent',color:upcoming ? 'blue' : 'black',padding:'5px',}}>Upcoming</span> </Col>
            <Col style={headingStyle} className='headstyle' onClick={setPastOnclick}><span style={{borderBottom:past ? '3px solid blue' : 'transparent',color:past ? 'blue' : 'black',padding:'5px'}}> Past </span> </Col>
        </Row>

        <Row style={{minHeight:"70vh",maxHeight:'70vh',overflow:'auto',marginTop:'20px'}} justify={'center'}>
          {upcoming && 
            <Col span={23}>
            {upcomingData.length <= 0 && <Row justify={'center'} style={{height:'100%',display:'flex',alignItems:'center'}}>
                  <Col>
                     <Row justify={'center'}> <Image src='https://static.zohocdn.com/meeting/images/no-upcoming-meeting.08995d6de11131e73a5d7d0738f7ae39.svg' height={'150px'} preview={false} /> </Row>
                     <Row justify={'center'}> <Col> <Row justify={'center'} className='headstyle'> No Upcoming Meetings.</Row> <Row justify={'center'} className='headstyle'> You can either start an instant meeting or schedule a meeting </Row></Col> </Row>

                  </Col>
                </Row>}

              {upcomingData && upcomingData.map((data)=>{
                return <Row style={listStyle} className='listStyle'>
                    <Col span={4} style={listDataStyle} className='listDataStyle'> 
                      <Row style={{display:'flex',alignItems:'center'}} justify={'space-between'}>
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
                          <Col span={20}> {data.sDate} <span style={{backgroundColor:'GreenYellow',marginLeft:'10px',padding:'4px'}}>  {data.sTime} </span></Col>
                      </Row>
                    </Col>
                    <Col span={4} style={listDataStyle} className='listDataStyle'>{data.topic}</Col>
                    <Col span={4} style={listDataStyle} className='listDataStyle'>{data.presenterEmail}</Col>
                    <Col span={4} style={listDataStyle} className='listDataStyle'>{data.durationInHours}</Col>
                    <Col span={4} style={listDataStyle} className='listDataStyle'> <Link> START MEETING </Link> </Col>
                    <Col span={4}>
                      <Row justify={'center'}>
                        <Space size={'large'}>
                          <Col><Link style={{color:'blue'}} className='listDataStyle'>Edit</Link></Col>
                          <Col><Link style={{color:'red'}} className='listDataStyle'> <Popconfirm title={'Are you sure to delete this meeting'} okText={'Delete Meeting'} cancelText={'No'}  onConfirm={()=>meetingDeletetion(data.meetingKey)} onCancel={()=>messageDrop('info','Deletion canceled. Everything stays as is!')}> Cancel </Popconfirm> </Link> </Col>
                        </Space>
                      </Row>
                    </Col>
                  </Row>
                })}
            </Col>
          }
           {past &&  
            <Col span={23}>
                {pastData.length <= 0 && <Row justify={'center'} style={{height:'100%',display:'flex',alignItems:'center'}}>
                  <Col >
                     <Row justify={'center'}> <Image src='https://static.zohocdn.com/meeting/images/no-upcoming-meeting.08995d6de11131e73a5d7d0738f7ae39.svg' height={'150px'} preview={false} /> </Row>
                     <Row justify={'center'}> <Col > <Row justify={'center'} className='headstyle'> No Past Meetings.</Row> <Row justify={'center'} className='headstyle'>You can either start an instant meeting or schedule a meeting </Row></Col> </Row>

                  </Col>
                </Row>}
              {pastData && pastData.map((data)=>{
                return <Row style={listStyle} className='listStyle' >
                    <Col span={5} style={listDataStyle} className='listDataStyle'> 
                      <Row style={{display:'flex',alignItems:'center'}} justify={'space-between'}>
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
                          <Col> {data.sDate} <span style={{backgroundColor:'orange',marginLeft:'10px',padding:'4px'}}>  {data.sTime} </span></Col>
                      </Row>
                    </Col>
                    <Col span={5} style={listDataStyle} className='listDataStyle'>{data.topic}</Col>
                    <Col span={5} style={listDataStyle} className='listDataStyle'>{data.presenterEmail}</Col>
                    <Col span={5} style={listDataStyle} className='listDataStyle'>{data.durationInHours}</Col>
                    <Col span={4} style={listDataStyle} className='listDataStyle'>
                      <Row justify={'space-around'}>
                      <Col style={{color:'red'}}>View</Col>
                      </Row>
                    </Col>
                  </Row>
                })}
            </Col>
          }
        </Row>
    </div>
  )
}

export default MeetingDetail