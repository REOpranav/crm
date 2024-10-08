import { Col, message, Popconfirm, Row, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import '../MeetingChart.css'
import axios from 'axios'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { MdAddToPhotos, MdOutlineCancel } from "react-icons/md";

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

const MeetingChart = () => {
  const navigate = useNavigate();
  const [meetingList, setMeetingList] = useState([])
  const [isload, setISLoad] = useState(false)
  const [truncate, setTruncate] = useState([])

  // this both array is storing the data which is seperted by date  
  const upcomingData = []
  const pastData = []

  // accessing rhe access tokena and user detail from session storage
  const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken')) || []
  const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail')) || []

  // this function is get the meeting list
  const checkMeetingTokensAvailable = () => {
    if (!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData)) {
      const MeetingCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "zsoid": meetingUserDetail ? meetingUserDetail.userDetails.zsoid : 0,
            "access_token": `${meetingAccessTokenData.access_token}`,
          }
        }
        try {
          const meetingListResponce = await axios.post(`http://localhost:3002/api/list`, extras)// this line send the request to node (server.js)      
          if (meetingListResponce.status == 200) {
            setMeetingList(meetingListResponce.data)
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
      const accessTokenResponce = await axios.post(`http://localhost:3002/api/meeting/delete`, data)
      setISLoad(false)
    } catch (err) {
      setISLoad(false)
    }
  }

  // this is calling function
  useEffect(() => {
    if (!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData)) {
      checkMeetingTokensAvailable()
    }
  }, [undefined])

  // this call the checkMeetingTokensAvailable function when isLoad is true   
  useEffect(() => {
    if (isload) {
      checkMeetingTokensAvailable()
    }
  })

  // this is seperation code (past and upcoming meeting)  
  if (meetingList) {
    const listData = meetingList.session || []
    listData.map((data) => {
      if (moment(data.startTime, 'MMM D, YYYY hh:mm A').isAfter(moment())) {
        upcomingData.push(data)
      } else {
        pastData.push(data)
      }
    })
  }

  useEffect(() => {
    const truncateWords = document.querySelector('.topic');
    function truncateText(spanElement) {
      const words = spanElement?.textContent?.trim().split(' ') || []
      if (words.length > 2) {
        spanElement.textContent = words.slice(0, 2).join(' ') + ` ...`;
      }
    }
    truncateText(truncateWords)
  }, undefined)

  const findingEvenNumber = (indexNumber)=>{   
    // indexNumber start with 0
    if (indexNumber % 2 === 0) {
        return '#daf5f7'
      }else{
        return 'transparent'
      }
  } 

  useEffect(()=>{
    findingEvenNumber()
  },[undefined])
  

  return (
    <div>
      <Row>
        <Col span={24} id='meeting-head'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><p id='meetingheading'>Upcoming Meetings &nbsp; <Tooltip title="You have two meetings" placement='right' color='#5a3bb6'><span>-&nbsp;{upcomingData?.length}</span></Tooltip></p> <p id='meetingPageLink' onClick={() => navigate('/meetingDetail')}>Meeting Page</p></div>
          <div id='meetingDeatailInDashboardHead'>
            {upcomingData?.map((e) => {
               const indexNumber = upcomingData?.indexOf(e)
              return <Row id='meetingDetailInDashboard' style={{backgroundColor:`${findingEvenNumber(indexNumber)}`}}>
                <Col span={5}><Row justify={'start'}>{e?.sDate}</Row></Col>
                <Col span={5}><Row justify={'start'}><span style={{ backgroundColor: '#aff4be' }}>{e?.sTime}</span></Row></Col>
                <Col span={5}><Tooltip title={e?.topic} color='grey'><Row className='topic' justify={'start'}>{e?.topic}</Row></Tooltip></Col>
                <Col span={5}><Row justify={'start'}>{e?.durationInHours}</Row></Col>
                <Col span={4}>
                  <Row justify={'space-between'}>
                    <Tooltip title="Join Meeting" color='blue'><a href={e?.joinLink} target='_blank'>Join</a></Tooltip>
                    <Tooltip title="Cancel Meeting" color='red'><Link style={{ color: 'red' }}> <Popconfirm title={'Are you sure to delete this meeting'} okText={'Cancel Meeting'} cancelText={'No'} onConfirm={() => meetingDeletetion(e.meetingKey)} onCancel={() => messageDrop('info', 'Deletion canceled. Everything stays as is!')}> <MdOutlineCancel color='red' /> </Popconfirm> </Link></Tooltip>
                  </Row>
                </Col>
              </Row>
            })}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MeetingChart