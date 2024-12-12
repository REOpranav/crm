import React from 'react'
import Dashboard from '../Dashboard'
import { Col, Row } from 'antd'
import '../Profilepage.css'

const ProfilePage = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div>
      <Dashboard />
      <div>
        <Row id='head'>Profile</Row>
          <Row className='profile'>
            <Col span={24}>
              <Row className='name_edit'>
                <Col span={12}><Row>pranavavadivel</Row></Col>
                <Col span={12}><Row>EDIT</Row></Col>
              </Row>
              <Row className='fullName_displayName'>
                <Col span={12}><Row>Full name</Row><Row>Pranavavadivel</Row></Col>
                <Col span={12}><Row>display name</Row><Row>Pranav</Row></Col>
              </Row>
              <Row className='gender_country'>
                <Col span={12}><Row>Gender</Row><Row>Male</Row></Col>
                <Col span={12}><Row>Country/Region</Row><Row>India</Row></Col>
              </Row>
              <Row className='state_language'>
                <Col span={12}><Row>State</Row><Row>Tamil Nadu</Row></Col>
                <Col span={12}><Row>Language</Row><Row>English-United States</Row></Col>
              </Row>
              <Row className='timeZone'>
                <Col span={12}><Row>Time Zone</Row> <Row>{timeZone}</Row></Col>
              </Row>
            </Col>
          </Row>

        <Row className='mailAddress'>
          <Row>
            <Col span={24}>My Email Addresses</Col>
            <Col span={24}>You can use the following email addresses to sign in to your account and also to reset your password if you ever forget it.</Col>
          </Row>
          <Row>
            <Col span={12}>logo boosingpranav@gmail.com</Col>
            <Col span={12}>king crown &nbsp; google logo</Col>
          </Row>
        </Row>

        <Row className='mobileNumber'>
          <Row>
            <Col span={24}>My Mobile Numbers</Col>
            <Col span={24}>View and manage all of the mobile numbers associated with your account.</Col>
          </Row>
          <Row>
            <Col span={12}>logo 7812817300</Col>
            <Col span={12}>shiled logo</Col>
          </Row>
        </Row>
      </div>
    </div>
  )
}

export default ProfilePage