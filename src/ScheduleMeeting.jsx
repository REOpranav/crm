import React, { useEffect, useState } from 'react'
import {message,Typography,Row,Col,Flex,Button,Dropdown,Popconfirm} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dashboard from './Dashboard'

// this is message ele from antd
 function messageSuccess(value){  
    message.success(`Sucessfully Update the ${value.firstname} Lead Datas`)
 }

const ScheduleMeeting = () => {
    const {Text,Title} = Typography
    const [meetingData,setMeetingData] = useState({})
    const [error,setError] = useState({})
  
    // this is handle chanhge function
    const handleChange = (e)=>{
        const {name,value} = e.target    
            setMeetingData((prevData) => ({
            ...prevData,
            [name]: value,
      }));
    }
  
    // validation Form
    function validation(leadFormValues) {
      let errorvalues = {}
      if (!leadFormValues.accountOwner.trim()) {
          errorvalues.accountOwner = 'Account Name is Required'
      }
  
      if (!leadFormValues.mobile.trim()) {
          errorvalues.mobile = 'Mobile Number is Required'
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

    
  // this code for patch work (onlu this problem)
  const onFinish = (e) => {
    e.preventDefault();
  };

  function getInputClass(value){            
    return error[value] ? 'inputError' : ''
  }

  return (
    <div>
      <Dashboard />
      <Row justify={'center'}>
          <Title level={3}>Schedule a Meeting</Title>
      </Row>
      <Row>
          <form onSubmit={checkForSubmitting}>
            <p>
                <label for="title">Title : </label>
                <input type="text" name="" id="title" placeholder={`TItle *`} value={meetingData.title} onChange={handleChange} className={getInputClass('accountOwner')}/> 
            </p>
            
            <p>
                <label for="meetingType">Meeting Type : </label>
                <input type="text" name="industry" id="industry" placeholder={`Meeting Type *`} value={meetingData.meetingType} onChange={handleChange} className={getInputClass('industry')}/>
            </p>

            <p>
                <label for="Date">Date : </label>
                <input type="date" name="date" id="date" placeholder={`Date *`} value={meetingData.date} onChange={handleChange} className={getInputClass('date')}/>
            </p>

            <p>
                <label for="time">Time : </label>
                <input type="time" name="time" id="time" placeholder={`Start Time`} value={meetingData.time} onChange={handleChange} className={getInputClass('time')}/>
            </p>

            <p>
                <label for="host">Host :</label>
                <input type="text" name="host" id="host" placeholder={`Host`} value={meetingData.host} onChange={handleChange} className={getInputClass('host')} />
            </p>
            
            <p>
                <label for="description">Agenda:</label>
                <textarea name="description" id="description" placeholder='Agenda' onChange={handleChange}/> 
            </p>
        </form>
      </Row>
    </div>
  )
}

export default ScheduleMeeting