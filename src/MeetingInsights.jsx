import { Button, Col, message, Row, Space, Typography } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'

const URL = window.location.href
const id  = URL.split('/').pop()
const span = 3

const MeetingInsights = () => {
    const {Text,Title} = Typography
    const [meetingData,setMeetingData] = useState([])

    // this code for initial load and when lead added
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/meetingSession/${id}`)                     
                if (responce.status === 200) {
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

    useEffect(() => {
        fetching()
    }, [undefined])
    console.log(meetingData);
    

  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'}>
            <Col>
                <Space>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                </Space>
            </Col>
            <Col>
              <Space>
                   <Button type='primary'>start Meeting</Button>
                   <Button>Edit</Button> 
                   <Button danger ghost>cancel</Button>
              </Space>
            </Col>
        </Row>
        <Row>
            <Col span={span}>logo</Col>
            <Col>
                <Row>{meetingData.session.startDate}</Row>
                <Row>{meetingData.session.timezone}</Row>
            </Col>
        </Row>
        <Row>
            <Col span={span}>logo</Col>
            <Col>
                <Row>
                    <Col>
                        <Row><Title level={5}>Host</Title></Row>
                        <Row>{meetingData.session.timezone}</Row>
                    </Col>
                    <Col>
                        <Row><Title level={5}> Department </Title></Row>
                        <Row>{meetingData.session.departmentName}</Row>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col></Col>
            <Col></Col>
        </Row>
        <Row>
            <Col></Col>
            <Col></Col>
        </Row>
        <Row>
            <Col></Col>
            <Col></Col>
        </Row>
    </div>
  )
}

export default MeetingInsights