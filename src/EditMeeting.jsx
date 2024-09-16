import { Button, message, Row, Space, Typography } from 'antd'
import { Color } from 'antd/es/color-picker'
import axios from 'axios'
import moment from 'moment'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// this is for get the current id
const URL = window.location.href
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

  const required = {
    color : 'red' 
  }

const EditMeeting = () => {

    const navigate = useNavigate();
    
    // accessing rhe access tokena and user detail from session storage
    const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken'))
    const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail'))

    const {Title} = Typography
    const [error,setError] = useState({})
    const [meetingData,setMeetingData] = useState({ //storing the form data in this state
        topic : '',
        agenda : '',
        statrDate : '',
        time : '',
        meridiem : '',
        participantsMail : '',
    })        

    // this is reset button function
    function resetClicked(){
      setMeetingData({
        topic : '',
        agenda : '',
        statrDate : '',
        time : '',
        meridiem : '',
        participantsMail : '',
      })
    }

    // this is handle chanhge function
     const handleChange = (e)=>{
      const {name,value} = e.target    
          setMeetingData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
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

  // Form validation
    function validation(meetingData) {
      let errorvalues = {}
      if (!meetingData.topic.trim()) {
          errorvalues.topic = 'Account Name is Required'
      }
  
      if (!meetingData.agenda.trim()) {
          errorvalues.agenda = 'Agenda is Required'
      }

      if (!meetingData.statrDate.trim()) {
        errorvalues.statrDate = 'Date is Required'
      }

      if (!meetingData.time.trim()) {
        errorvalues.time = 'Time is Required'
      }

      if (!meetingData.meridiem.trim()) {
        errorvalues.meridiem = 'Meridiem is Required'
      }

      if (!meetingData.participantsMail.trim()) {
        errorvalues.participantsMail = 'participantsMail is Required'
      }
      return errorvalues
    }
  
   // this function for "to see if the input value is in error or not , if it in error ,it will change the class name into inputerror"
    function getInputClass(value){
     return error[value] 
    }

  // this code for patch work (onlu this problem)
    const onFinish = (e) => {
      e.preventDefault()
      createMeetingCredencial()
    }
    
  // this function is cerate meeting credencial
    const createMeetingCredencial = async()=>{   
      const data = {
        "session": {
          "topic": `${meetingData.topic}`,
          "agenda": `${meetingData.agenda}`,
          "presenter":  meetingUserDetail.userDetails.zuid,
          "startTime": `${moment(meetingData.statrDate).format('ll')} ${meetingData.time} ${meetingData.meridiem}`,
          "duration": 3600000,
          "timezone": "Asia/Calcutta",
      }
    }

    // this is params,sending to backend for important extra information like zoho org ID and Access Token
      const extras = {
        "params" : {
          "extras" : {
            "zsoid": meetingUserDetail.userDetails.zsoid,
            "access_token": `${meetingAccessTokenData.access_token}`,
           }
         }
      }
        
      try {
          const accessTokenResponce = await axios.post(`http://localhost:3002/api/create`,data,extras) // this line send the request to node (server.js)      
            if (accessTokenResponce.status == 200) {
              createMeeting(accessTokenResponce.data) // This is for showing "sussessfully created message" and store the responce sesssion in mock server              
            }
          } catch (err) {
           if (err.message == "Request failed with status code 500") {
              messageDrop('warning','Token Expired. Re-Generate the Tokens')
           }
          console.log(err.message)
        }
      }  

    // zoho meeting intergaration function to store the responce data IN DB.JSON
    const createMeeting = async(data)=>{
      messageDrop('success','Meeting Created Successfully') // this is showing the message (ANTD)
    
    // this object and below function are storing the meeting seesion data (only successfully created meeting data)
      const sessionData = {
        id : id, // giving the same contact person id for showing in his/her deatil module
        key : Math.floor(Math.random() * 1000000000),
        session : data.session
      }

      const logMeetignSession = async()=>{
        try {
              const URL = `http://localhost:3000/meetingSession` // stoting in this URL
              const posting = await axios.post(URL,sessionData) 
              if (posting.status === 201) {
                messageDrop('success','Session are stored in meeting log')
              }
            } catch (err) {
              if (err.response) {
                message.error('Error');
              } else if (err.request) {
                message.error('Error: No response from server.')
              } else {
                message.error('Error: '+ err.message);
              }
            }
          }
        logMeetignSession()

     // this is for changing the page actual contact detail module
       navigate(`/contactDetail/detail/${id}`)
    }
    
  return (
    <div>
         <Row>
              <form onSubmit={checkForSubmitting}>
                <p>
                    <label for="topic"><span style={required}>*</span> Topic : </label>
                    <input type="text" name="topic" id="topic" placeholder={`topic`} value={meetingData.topic} onChange={handleChange} className={getInputClass('topic') ? "inputError" : 'errorClear'}/> 
                </p>
                
                <p>
                    <label for="agenda"> <span style={required}>*</span> Agenda:</label>
                    <textarea name="agenda" id="agenda" placeholder='Agenda' value={meetingData.agenda} onChange={handleChange} className={getInputClass('agenda') ? "inputError" : 'errorClear'}/>
                </p>

                <p>
                    <label for="statrDate"> <span style={required}>*</span> Date : </label>
                    <input type="date" name="statrDate" id="statrDate" placeholder={`start Date *`} value={meetingData.statrDate} onChange={handleChange} className={getInputClass('statrDate') ? "inputError" : 'errorClear'}/>
                </p>

                <p>
                    <label for="time"> <span style={required}>*</span> Time : </label>
                    <input type="time" name="time" id="time" placeholder={`Start Time`} value={meetingData.time} onChange={handleChange} className={getInputClass('time') ? "inputError" : 'errorClear'}/>
                </p>  

                <p>
                    <label for="meridiem"> <span style={required}>*</span> AM / PM : </label>
                    <select name="meridiem" id="meridiem" value={meetingData.meridiem} onChange={handleChange} className={getInputClass('time') ? "inputError" : 'errorClear'}>
                       <option value="AM" defaultChecked selected>AM</option>
                       <option value="PM">PM</option>
                    </select>
                </p>

                <p>
                    <label for="participantsMail"> <span style={required}>*</span> Host :</label>
                    <input type="email" name="participantsMail" id="participantsMail" placeholder={`participantsMail *`} value={meetingData.participantsMail} onChange={handleChange} className={getInputClass('participantsMail') ? "inputError" : 'errorClear'} />
                </p>

              <Space>
                <Button type='default' danger onClick={resetClicked}>Reset</Button>
                <Button type='primary' onClick={checkForSubmitting}>Submit</Button>
              </Space>
            </form> 
          </Row>

    </div>
  )
}
export default EditMeeting