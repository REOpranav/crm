import { Button, Col,Image, message, Row, Space, Typography,Tooltip, Popconfirm } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import './MeetingInsights.css'
import Title from 'antd/es/skeleton/Title';
import './Dashboard.css'

// this is style code for this components
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

const greyColor = {
    color : 'grey',
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
    const navigate = useNavigate();
    const {Text} = Typography
    const URL = window.location.href
    const id  = URL.split('/').pop()
    const [meetingData,setMeetingData] = useState(null)
    const [isLoad,setIsLoad] = useState([])


   // accessing rhe access tokena and user detail from session storage
   const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken')) || [] 
   const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail')) || []

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
      console.log('yes');
      
        return window.open(`${meetingData.session.startLink}`)        
    }

    // this is join meeting function when click the join link 
    const joinMeeting = ()=>{
        return window.open(`${meetingData.session.joinLink}`) 
    }

    // this is for deleting the meeting in database and meeting application
    const meetingDeletetion = async(details)=>{      
        try {
          const data = {
            "session": {
              "zsoid":await meetingUserDetail.userDetails.zsoid,
              "meetingKey":await details,
              "accessToken":await meetingAccessTokenData.access_token
          }
        }
            const accessTokenResponce = await axios.post(`http://localhost:3002/api/meeting/delete`,data)
            if (accessTokenResponce.status == 200) {
              deletingMeetingDataInDb()
            }
        } catch (err) {        
            if (err.message == "Request failed with status code 500") { 
              deletingMeetingDataInDb(details)
            }
        }        
      }
  
      // This code is for deleting the meeting
    const deletingMeetingDataInDb = async()=>{
        setIsLoad(true)
        try {
          const URL = 'http://localhost:3000/meetingSession';        
          const deleting = await axios.delete(`${URL}/${id}`)

          if (deleting.status === 200) {
            message.success("Successfully Deleted");
            navigate(`/contactDetail/detail/${id}`)
          }
          setIsLoad(false)
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
  
    // this is back one step
    const back = ()=>{
        window.history.back(-1)
    }

    // this is for initial load
    useEffect(()=>{
        if (!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData)) {
            fetching()
        }
    },[undefined])

  return (
    <div>
        <Dashboard />
        {!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData) ? <>
        {meetingData !== null && <>
        <Row justify={'space-between'} style={topicheadStyles}>
            <Col>
                <Row style={{display:'flex',alignItems:'center'}}>
                    <Col style={{padding:'10px'}} className='backArrow'> <IoMdArrowRoundBack size={'20px'} onClick={back}/></Col> 
                    <Col style={{padding:'10px',fontSize:'20px',color:'Grey'}} className='PoppinsFont'>Topic : <span style={{color:'red'}}> {meetingData.session.topic} </span> </Col>
                </Row>
            </Col>
            <Col>
              <Space>
                   <Popconfirm title={'Are you sure to Start this meeting'} okText={'Start Meeting'} cancelText={'No'} onConfirm={() => startLink()} onCancel={()=>messageDrop('info','Start Canceled. Everything stays as is!')}> <Button type='primary' style={buttonStyle} target='_blank'> START MEETING </Button> </Popconfirm> 
                   <Link to={`/editing/meetingDetail/${id}`}> <Button style={buttonStyle}>Edit</Button> </Link> 
                   <Popconfirm title={'Are you sure to Cancel this meeting'} okText={'Cancel Meeting'} cancelText={'No'} onConfirm={() => meetingDeletetion(meetingData.session.meetingKey)} onCancel={()=>messageDrop('info','Deletion Canceled. Everything stays as is!')}> <Button danger ghost style={buttonStyle}>cancel</Button> </Popconfirm> 
              </Space>
            </Col>
        </Row>
        <Row style={{minHeight:"70vh",maxHeight:'70vh',overflow:'auto',marginTop:'20px'}} justify={'start'}>
            <Col span={24} >
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/calendar-icon.98c58f33269cd9ecc34b80fb74414779.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row className='PoppinsFont'>{meetingData.session.startDate}</Row>
                    <Row className='PoppinsFont'>{meetingData.session.timezone}</Row>
                </Col>
            </Row> 
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/cohost-icon.cbdcae9889cfe6314bc8b684b5835dc3.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row className='PoppinsFont'> Department</Row>
                    <Row className='PoppinsFont' style={greyColor}>{meetingData.session.departmentName}</Row>
                </Col>
            </Row>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/participants-icon.38f5f7017721c3ce6541c5dff32e84af.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row className='PoppinsFont'>Join Meeting</Row>
                    <Link > <Popconfirm title={'Are you sure to Join this meeting'} okText={'Join Meeting'} cancelText={'No'} onConfirm={() => joinMeeting()} onCancel={()=>messageDrop('info','Joining the meeting is Canceled')}>  {meetingData.session.joinLink} </Popconfirm> </Link>
                </Col>
            </Row>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}><Image src='https://static.zohocdn.com/meeting/images/agenda-icon.ab387d045bfffc13a48a42f613a4d0c2.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row className='PoppinsFont'>Agenda</Row>
                    <Row className='PoppinsFont'  style={greyColor}>{meetingData.session.agenda}</Row>
                </Col>
            </Row>
            <Row style={styleForDetail}>
                <Col span={span} style={boderRadius}> <Image src='https://static.zohocdn.com/meeting/images/reminder-icon.9f7edcde0c97eb31d51d32275b27266e.svg' style={styleForImage}/></Col>
                <Col style={styleForDetailData}>
                    <Row className='PoppinsFont'>Time zone</Row>
                    <Row className='PoppinsFont'  style={greyColor}>{meetingData.session.timezone}</Row>
                </Col>
            </Row>
            </Col>
       </Row>  
        </>}
        </> : <>
                <Col style={{height:'90vh',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid black'}}>
                <span>
                    <Row style={{padding:'20px'}}>
                        <Space>
                            <Button type='primary' onClick={back}>Back one Step</Button>
                            <Link to={`/contacts/meetingStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>     
                        </Space>     
                    </Row>
                    <Row justify={'center'}> <Image src='https://www.submitshop.com/wp-content/uploads/2022/12/Increase-Customer-Engagement.png' height={'200px'} preview={false} style={{opacity:'0.7'}} /> </Row>
                    <Row> <Title level={4}> Token <span style={{backgroundColor:'orange'}}> expired</span> or not Generate . <span style={{backgroundColor:'greenyellow'}}> Generate</span> by click that <span style={{color:'#5a3bb6'}}> Re-Generate the Tokens </span>Button </Title></Row>
                    {Array.isArray(meetingUserDetail) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{color:'orangered',marginLeft:'5px',marginRight:'5px'}}>Zoho User </span> Token </Row>}
                    {Array.isArray(meetingAccessTokenData) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{color:'orangered',marginLeft:'5px',marginRight:'5px'}}>Zoho Meeting Access </span> Token </Row>}
                </span>
                </Col>
            </>}
    </div>
  )
}

export default MeetingInsights