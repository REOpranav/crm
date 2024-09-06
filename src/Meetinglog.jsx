import { Button, message, Row,Table,Typography } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Meetinglog = ({id}) => {
     
    const {Text} = Typography
    const [sessionData,setSessionData] = useState([])

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

    // this refers the column layout for showing data (Antd)
    const column = [
        {
          title: 'Topic',
          dataIndex: 'topic',
          key: 'topic',
          render : (value,records) => <Link to={`/deals/detail/${records.id}`}> {records.topic} </Link>
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

        // {
        //   title:'closing Date',
        //   dataIndex: 'closingDate',
        //   key: 'closingDate',
        //   render: (text) => {
        //     const currentDate = new Date();
        //     const parsedDate = new Date(text);
        //     return (
        //       <Text
        //         style={{
        //           backgroundColor: parsedDate < currentDate ? 'red' : 'lightGreen',
        //         }}
        //       >
        //         {text}
        //       </Text>
        //     );
        //   }
        // },
                  
        {
          title:'departmentName',
          dataIndex: 'departmentName',
          key: 'departmentName',
        },
     ]

    // THIS IS FOR FILTERING
    const filterParticularSessionID = sessionData.filter((values)=>{
        if (values.id === id) {        
          return values
        }
      })    
        
      console.log(filterParticularSessionID);
      
      let data = [] // This array is showing the data in table (antd frameworks)
      for (const datas of filterParticularSessionID) {
          let changeTOObject = {
             key :datas.key,
             id : datas.id,
             topic:datas.session.topic,
             startDate:datas.session.startDate,
             endTime:datas.session.endTime,
             departmentName:datas.session.departmentName,
          }
          data.push(changeTOObject)          
      }
    
     useEffect(()=>{
        fetching()
    },[undefined])
  return (
    <div>
     <Row style={{padding:'10px',marginTop:'10px'}} justify={'start'}> 
          <Text style={{color:'grey',fontWeight:'lighter',fontFamily:'monospace'}}> Meeting schedules </Text>
     </Row>
     <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400}}/>

    </div>
  )
}

export default Meetinglog