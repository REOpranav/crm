import { Button, message, Row, Space, Typography } from 'antd'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  // this is for get the current id
    const URL = window.location.href
    const id = URL.split('/').pop()
    const navigate = useNavigate();
    
    // accessing rhe access tokena and user detail from session storage
    const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken'))
    const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail'))

    const {Title} = Typography
    const [error,setError] = useState({})
    const [savedMeetingInfo,setSavedMeetingInfo] = useState([])
    const [savedMeetingID,setSavedMeetingId] = useState([])
    const [meetingData,setMeetingData] = useState({})    
      
    // get the Saved Meeting Info from Db.json
    const fetching = async()=>{
      try {
      const responce = await axios.get(`http://localhost:3000/meetingSession/${id}`) // fethch the data using the module name 
      if (responce.status === 200) {
          setSavedMeetingInfo(await responce.data.session)
          setSavedMeetingId(await responce.data)        
        }
      } catch (err) {
          if (err.response) {
              message.error('Error: ' + err.response.status +' - '+ (err.response.data.message || 'Server Error'));
          } else if (err.request) {
              message.error('Error: No response from server.');
          } else {
              message.error('Error: ' + err.message);
          }
      }
    }
    
    // initial fetch function occurs
    useEffect(()=>{
      fetching()      
    },[undefined])
    
    // this is for set the data in that particular for reference
    useEffect(()=>{
     if (savedMeetingInfo) {
        setMeetingData({
          topic : savedMeetingInfo.topic || '',
          agenda : savedMeetingInfo.agenda || '',
          statrDate : savedMeetingInfo.statrDate || '',
          time : savedMeetingInfo.time || '',
          meridiem : savedMeetingInfo.meridiem || '',
          participantsMail : '',
        })
      }
    },[savedMeetingInfo])

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
      return errorvalues
    }
  
   // this function for "to see if the input value is in error or not , if it in error ,it will change the class name into inputerror"
    function getInputClass(value){
     return error[value] 
    }

  // this code for patch work (onlu this problem)
    const onFinish = (e) => {
      e.preventDefault()
      MeetingCredencial()
    }    
    
  // this function is cerate meeting credencial
    const MeetingCredencial = async()=>{   
      const data = {
        "session": {
          "topic": `${meetingData.topic}`,
          "agenda": `${meetingData.agenda}`,
          "presenter": meetingUserDetail.userDetails.zuid,
          "startTime": `${moment(meetingData.statrDate).format('ll')} ${meetingData.time} ${meetingData.meridiem}`,
          "duration": 3600000,
          "timezone": "Asia/Calcutta",
          "participants": [
            {
                email: `${meetingData.participantsMail}`
            }
        ]
      }
    }
    
    // this is params,sending to backend for important extra information like zoho org ID and Access Token
      const extras = {
        "params" : {
          "extras" : {
            "zsoid": meetingUserDetail.userDetails.zsoid,
            "access_token": `${meetingAccessTokenData.access_token}`,
            "meetingKey":`${savedMeetingInfo.meetingKey}`
          }
         }
      }
        
      try {
          const accessTokenResponce = await axios.post(`http://localhost:3002/api/edit`,data,extras) // this line send the request to node (server.js)      
          if (accessTokenResponce.status == 200) {
            editMeeting(accessTokenResponce.data) // This is for showing "sussessfully created message" and store the correct sesssion in mock server              
          }
          } catch (err) {
           if (err.message == "Request failed with status code 500") {
              messageDrop('warning','Token Expired. Re-Generate the Tokens')
           }
          console.log(err.message)
        }
      }  
      
    // zoho meeting intergaration function to store the responce data IN DB.JSON
    const editMeeting = async(data)=>{      
      console.log(data);
      
      const datas = {
        id : savedMeetingID.id,
        session : data.session
      }

      const backToModule = ()=>{
        return window.history.back(-2)
      }
            
      const logMeetignSession = async()=>{
        try {
              const URL = `http://localhost:3000/meetingSession/${savedMeetingID.id}` // stoting in this URL
              const posting = await axios.put(URL,datas)             
              if (posting.status === 200) {
                messageDrop('success','Session Edited')
              }
              backToModule()
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
      
        if (data.session) {
          logMeetignSession()
        }else{
          messageDrop('error','Error while Reschedule the meeting')
        }

    }    
  return (
    <div>
         <Row>
              <form onSubmit={checkForSubmitting}>
                <p>
                    <label for="topic"><span style={required}>*</span> Topic : </label>
                    <input type="text" name="topic" id="topic" placeholder={`${savedMeetingInfo.topic ? savedMeetingInfo.topic : 'Topic'}`} value={meetingData.topic} onChange={handleChange} className={getInputClass('topic') ? "inputError" : 'errorClear'}/> 
                </p>
                
                <p>
                    <label for="agenda"> <span style={required}>*</span> Agenda:</label>
                    <textarea name="agenda" id="agenda" placeholder={`${savedMeetingInfo.agenda ? savedMeetingInfo.agenda : 'Agenda'}`} value={meetingData.agenda} onChange={handleChange} className={getInputClass('agenda') ? "inputError" : 'errorClear'}/>
                </p>

                <p>
                    <label for="statrDate"> <span style={required}>*</span> Date : </label>
                    <input type="date" name="statrDate" id="statrDate" placeholder={`${savedMeetingInfo.statrDate ? savedMeetingInfo.statrDate  : 'start Date'}`} value={meetingData.statrDate} onChange={handleChange} className={getInputClass('statrDate') ? "inputError" : 'errorClear'}/>
                </p>

                <p>
                    <label for="time"> <span style={required}>*</span> Time : </label>
                    <input type="time" name="time" id="time" placeholder={`${savedMeetingInfo.time ? savedMeetingInfo.time  : 'time'}`} value={meetingData.time} onChange={handleChange} className={getInputClass('time') ? "inputError" : 'errorClear'}/>
                </p>  

                <p>
                    <label for="meridiem"> <span style={required}>*</span> AM / PM : </label>
                    <select name="meridiem" id="meridiem" value={meetingData.meridiem} onChange={handleChange} className={getInputClass('meridiem') ? "inputError" : 'errorClear'}>
                       <option value="" style={{color:'red'}}>Select Meridiem</option>
                       <option value="AM" selected>AM</option>
                       <option value="PM">PM</option>
                    </select>
                </p>

                <p>
                    <label for="participantsMail"> <span style={required}>*</span> Participants Mail :</label>
                    <input type="email" name="participantsMail" id="participantsMail" placeholder={`${savedMeetingInfo.participantsMail ? savedMeetingInfo.participantsMail : 'Participants Mail'}`} value={meetingData.participantsMail} onChange={handleChange} className={getInputClass('participantsMail') ? "inputError" : 'errorClear'} />
                </p>

              <Space>
                <Button type='default' danger onClick={() =>resetClicked}>Reset</Button>
                <Button type='primary' onClick={checkForSubmitting}>Submit</Button>
              </Space>
            </form> 
          </Row>

    </div>
  )
}
export default EditMeeting