import React, { useEffect, useState } from 'react'
import {message,Typography,Row,Col,Flex,Button,Dropdown,Popconfirm, Space} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dashboard from './Dashboard'

// this is for get the current id
  const URL = window.location.href
  const id = URL.split('/').pop()
 
const ScheduleMeeting = () => {
    const {Text,Title} = Typography
    const [error,setError] = useState({})
    const [meetingData,setMeetingData] = useState({
        title : '',
        meetingType : '',
        date : '',
        time : '',
        host : ''
    })
  
    // this is handle chanhge function
    const handleChange = (e)=>{
        const {name,value} = e.target    
            setMeetingData((prevData) => ({
            ...prevData,
            [name]: value,
      }));
    }
  
    // validation Form
    function validation(meetingData) {
      let errorvalues = {}
      if (!meetingData.title.trim()) {
          errorvalues.title = 'Account Name is Required'
      }
  
      if (!meetingData.meetingType.trim()) {
          errorvalues.meetingType = 'Meeting Type is Required'
      }

      if (!meetingData.date.trim()) {
        errorvalues.date = 'Date is Required'
      }

      return errorvalues
    }
  
    //checking tthe form fileds are filled or not
    function checkForSubmitting(e) {
        let checkHavingErrorInInputField = Object.keys(validation(meetingData)).length === 0 // if it was greater than 0 that mean not fill the manditory field
        if (checkHavingErrorInInputField) {
            onFinish(e)
        }else{
            setError(validation(meetingData))
            message.error('Fill the Manditory Form Fields')
        }
    }

    // this is reset button function
    function resetClicked(){
      setMeetingData({
        title : '',
        meetingType : '',
        date : '',
        time : '',
        host : ''
      })
    }

    // this code for patch work (onlu this problem)
    const onFinish = (e) => {
      e.preventDefault()
    }

    function getInputClass(value){
      return error[value] 
    }

   
  return (
    <div>
      <Dashboard />
      <Row justify={'center'}>
      </Row>

    
      <Title level={3}> Schedule a Meeting </Title> 
      <Row>
          <form onSubmit={checkForSubmitting}>
            <p>
                <label for="title">Title : </label>
                <input type="text" name="title" id="title" placeholder={`TItle *`} value={meetingData.title} onChange={handleChange} className={getInputClass('title') ? "inputError" : 'errorClear'}/> 
            </p>
            
            <p>
                <label for="meetingType">Meeting Type : </label>
                <input type="text" name="meetingType" id="meetingType" placeholder={`Meeting Type *`} value={meetingData.meetingType} onChange={handleChange} className={getInputClass('meetingType') ? "inputError" : 'errorClear'}/>
            </p>

            <p>
                <label for="Date">Date : </label>
                <input type="date" name="date" id="date" placeholder={`Date *`} value={meetingData.date} onChange={handleChange} className={getInputClass('date') ? "inputError" : 'errorClear'}/>
            </p>

            <p>
                <label for="time">Time : </label>
                <input type="time" name="time" id="time" placeholder={`Start Time`} value={meetingData.time} onChange={handleChange} className={getInputClass('time') ? "inputError" : 'errorClear'}/>
            </p>

            <p>
                <label for="host">Host :</label>
                <input type="text" name="host" id="host" placeholder={`Host`} value={meetingData.host} onChange={handleChange} className={getInputClass('host') ? "inputError" : 'errorClear'} />
            </p>
            
            <p>
                <label for="description">Agenda:</label>
                <textarea name="description" id="description" placeholder='Agenda' onChange={handleChange}/> 
            </p>

          <Space>
              <Button type='default' danger  onClick={resetClicked}>Reset</Button>
            <Button type='primary' onClick={checkForSubmitting}>Submit</Button>
          </Space>
        </form>
      </Row>
    </div>
  )
}

export default ScheduleMeeting