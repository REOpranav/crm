import { message, Row,Table,Typography,Popconfirm} from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Meetinglog.css'

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

const Meetinglog = ({id}) => {
    const {Text} = Typography
    const [sessionData,setSessionData] = useState([])
    const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail'))
    const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken'))
    const [loadTime,setLoadTime] = useState(false)

     // this code for initial load and when lead added
     const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/meetingSession`)                     
                if (responce.status === 200) {
                    setSessionData(await responce.data)
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

    // this is for deleting the meeting in database and meeting application
    const meetingDeletetion = async(details)=>{      
      try {
        const data = {
          "session": {
            "zsoid":await meetingUserDetail.userDetails.zsoid,
            "meetingKey":await details.meetingKey,
            "accessToken":await meetingAccessTokenData.access_token
        }
      }
          const accessTokenResponce = await axios.post(`http://localhost:3002/api/meeting/delete`,data)
          if (accessTokenResponce.status == 200) {
            deletingMeetingDataInDb(details)
          }
      } catch (err) {        
          if (err.message == "Request failed with status code 500") { 
            deletingMeetingDataInDb(details)
          }
      }        
    }

    // This code is for deleting the meeting
    const deletingMeetingDataInDb = async(values)=>{
      setLoadTime(true)
      try {
        const URL = 'http://localhost:3000/meetingSession';
        const deleting = await axios.delete(`${URL}/${values.id}`)
        if (deleting.status === 200) {
          message.success("Successfully deleted the data");
        }
        setLoadTime(false)
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

    // this refers the column layout for showing data (Antd)
    const column = [
        {
          title: 'Topic',
          dataIndex: 'topic',
          key: 'topic',
          render : (value,records) => <Link to={`/meetingDetail/${records.id}`}> {records.topic} </Link>
        },
        {
          title: 'Meeting start',
          dataIndex: 'startDate',
          key: 'startDate',
        },
        {
          title:'Meeting End',
          dataIndex: 'endTime',
          key: 'endTime',
        },
        {
          title:'closing Date',
          dataIndex: 'closingDate',
          key: 'closingDate',
          render: (text) => {
            const currentDate = new Date();
            const parsedDate = new Date(text);
            return (
              <Text
                style={{
                  backgroundColor: parsedDate < currentDate ? 'red' : 'lightGreen',
                }}
              >
                {text}
              </Text>
            );
          }
        },        
        {
          title:'departmentName',
          dataIndex: 'departmentName',
          key: 'departmentName',
          render : (value,records) => <Row justify={'space-between'}> {value} <Text className='deleteIcon' style={{color:'red'}}> <Popconfirm title={'Are you sure to delete this meeting'} okText={'Delete'} cancelText={'No'}  onConfirm={()=>meetingDeletetion(records)} onCancel={()=>messageDrop('info','Deletion canceled. Everything stays as is!')}> cancel </Popconfirm> </Text> </Row>
        },
     ]

    // this is for filteration    
    const filterParticularSessionID = sessionData.filter((values)=>{
        if (values.id === id) {          
          return values
        }
      })
      let data = [] // This array is showing the data in table (antd frameworks)
      for (const datas of filterParticularSessionID) {
          let changeTOObject = {
             key :datas.key,
             id : datas.id,
             topic:datas.session.topic,
             startDate:datas.session.startDate,
             endTime:datas.session.endTime,
             departmentName:datas.session.departmentName,
             meetingKey:datas.session.meetingKey,
          }
          data.push(changeTOObject)
      }
    
     useEffect(()=>{
      fetching()
     },[undefined])
     
     useEffect(()=>{
      if (loadTime) {
       fetching()  
      }
     })

  return (
    <div>
     <Row style={{padding:'10px',marginTop:'10px'}} justify={'start'}> 
        <Text style={{color:'grey',fontWeight:'lighter',fontFamily:'monospace'}}> Meeting schedules </Text>
     </Row>
     <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400}} />
    </div>
  )
}

export default Meetinglog