import { Button, Col,Image, message, Row, Space, Typography,Tooltip, Popconfirm } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import './MeetingInsights.css'

const URL = window.location.href
const id  = URL.split('/').pop()

// this acsss styles 
const span = 3
const styleForDetail = {
    display:'flex',
    alignItems:'center',
    padding:'20px',
}

const styleForImage = {
    width:'30px'   
}

const buttonStyle = { 
   borderRadius:'30px',
   padding : '20px'
}

const topicheadStyles = {   
 display:'flex',
 alignItems:'center',
 padding:'20px'
}

const styleForDetailData = {
   padding : '10px',
}

const boderRadius = {
    borderRight : '1px solid black'
}

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

const MeetingInsights = () => {
    const {Text} = Typography
    const [meetingData,setMeetingData] = useState(null)

    // this code for initial load and when lead added
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/meetingSession/${id}`)                     
                if (responce.status == 200) {
                    setMeetingData(await responce.data)
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

    // This function for start the meeting when click the start meeting button
    const startLink = ()=>{
        return window.open(`${meetingData.session.startLink}`)        
    }

    const joinMeeting = ()=>{
        return window.open(`${meetingData.session.joinLink}`) 
    }

    // this is back one step
    const back = ()=>{
        window.history.back(-1)
    }

    // this is for initial load
    useEffect(()=>{
        fetching()
    },[undefined])

   useEffect(()=>{
     console.log(meetingData);
   })

  return (
    <div>
        <Dashboard />
        {meetingData !== null && <>
        <Row justify={'space-between'} style={topicheadStyles}>
            <Col>
                <Row style={{display:'flex',alignItems:'center'}}>
                    <Col style={{padding:'10px'}} className='backArrow'> <IoMdArrowRoundBack size={'20px'} onClick={back}/></Col> 
                    <Col style={{padding:'10px',fontSize:'20px',fontFamily:'cursive',fontWeight:'lighter',color:'red'}}> {meetingData.session.topic}  </Col>
                </Row>
            </Col>
            <Col>
              <Space>
                   <Popconfirm title={'Are you sure to Start this meeting'} okText={'Start Meeting'} cancelText={'No'} onConfirm={() => startLink()} onCancel={()=>messageDrop('info','Start Canceled. Everything stays as is!')}> <Button type='primary' style={buttonStyle} target='_blank'> START MEETING </Button> </Popconfirm> 
                   <Button style={buttonStyle}>Edit</Button>
                   <Button danger ghost style={buttonStyle}>cancel</Button>
              </Space>
            </Col>
        </Row>

        <Row style={{minHeight:"70vh",maxHeight:'70vh',overflow:'auto',marginTop:'20px'}} justify={'start'}>
            <Col span={24}>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/calendar-icon.98c58f33269cd9ecc34b80fb74414779.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row>{meetingData.session.startDate}</Row>
                    <Row>{meetingData.session.timezone}</Row>
                </Col>
            </Row> 
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/cohost-icon.cbdcae9889cfe6314bc8b684b5835dc3.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row>Department</Row>
                    <Row>{meetingData.session.departmentName}</Row>
                </Col>
            </Row>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/participants-icon.38f5f7017721c3ce6541c5dff32e84af.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row>Join Meeting</Row>
                    <Popconfirm title={'Are you sure to Join this meeting'} okText={'Join Meeting'} cancelText={'No'} onConfirm={() => joinMeeting()} onCancel={()=>messageDrop('info','Joining the meeting is Canceled')}> <Link type='link' target='_blank'> {meetingData.session.joinLink}  </Link> </Popconfirm> 
                </Col>
            </Row>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/agenda-icon.ab387d045bfffc13a48a42f613a4d0c2.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row>Agenda</Row>
                    <Row>{meetingData.session.agenda}</Row>
                </Col>
            </Row>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}> <Image src='https://static.zohocdn.com/meeting/images/reminder-icon.9f7edcde0c97eb31d51d32275b27266e.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row>Agenda</Row>
                    <Row>{meetingData.session.timezone}</Row>
                </Col>
            </Row>
            </Col>
       </Row>   
    </>}
    </div>
  )
}

export default MeetingInsights