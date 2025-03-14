import React, { useEffect, useState } from 'react'
import { message, Typography, Row, Button, Space, Image, Col } from 'antd'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Dashboard from './Dashboard'
import moment from 'moment';
import EditMeeting from './EditMeeting'
import './ScheduleMeeting.css'

// this is for get the current id
const URL = window.location.pathname
const id = URL.split('/').pop()

// this is message setup (ant design)
const messageDrop = (type, content) => {
  message.open({
    type: type,
    content: content
  })
}

const required = {
  color: 'red'
}

const contactButton = {
  marginTop: '10px',
  padding: '20px'
}

const ScheduleMeeting = () => {
  const navigate = useNavigate();
  // accessing rhe access tokena and user detail from session storage
  const meetingAccessTokenData = sessionStorage.getItem('ZOHOmailMessageAccessToken') ?? []
  const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail')) ?? []  

  const { Title } = Typography
  const [error, setError] = useState({})
  const [contactData, setContactData] = useState([])
  const [selectedContact, setSelectedContact] = useState([])
  const [meetingData, setMeetingData] = useState({ //storing the form data in this state
    topic: '',
    agenda: '',
    statrDate: '',
    time: '',
    meridiem: '',
    participantsMail: '',
  })

  // this is reset function
  const resetClicked = () => {
    setMeetingData({
      topic: '',
      agenda: '',
      statrDate: '',
      time: '',
      meridiem: '',
      participantsMail: '',
    })
  }

  // this is handle chanhge function
  const handleChange = (e) => {
    const { name, value } = e.target
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
    } else {
      setError(validation(meetingData))
      message.error('Fill the Manditory Form Fields')
    }
  }

  // Form validation
  function validation(meetingData) {
    let errorvalues = {}
    if (!meetingData.topic.trim()) {
      errorvalues.topic = 'Topic is Required'
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
  function getInputClass(value) {
    return error[value]
  }

  // this code for patch work (onlu this problem)
  const onFinish = (e) => {
    e.preventDefault()
    createMeetingCredencial()
  }

  // this function is create meeting credencial and send to code create meeting in zoho meeting 
  const createMeetingCredencial = async () => {
    const data = {
      "session": {
        "topic": `${meetingData.topic}`,
        "agenda": `${meetingData.agenda}`,
        "presenter": meetingUserDetail?.zuid,
        "startTime": `${moment(meetingData.statrDate).format('ll')} ${meetingData.time} ${meetingData.meridiem}`,
        "duration": 3600000,
        "timezone": "Asia/Calcutta",
      }
    }

    // this is params,sending to backend for important extra information like zoho org ID and Access Token
    const extras = {
      "params": {
        "extras": {
          "zsoid": meetingUserDetail?.zsoid,
          "access_token": `${meetingAccessTokenData}`,
        }
      }
    }

    try {
      const accessTokenResponce = await axios.post(`http://localhost:3002/api/create`, data, extras)// this line send the request to node (server.js)      
      if (accessTokenResponce.status == 200) {
        createMeetingInDb(accessTokenResponce?.data) // This is for showing "sussessfully created message" and store the responce sesssion in mock server                

        if (window.location.pathname == '/ScheduleMeeting') {
          setTimeout(() => {
            navigate("/meetingDetail")
          }, 1 * 600)
        }
      }
    } catch (err) {
      if (err.message == "Request failed with status code 500") {
        messageDrop('warning', 'Token Expired. Re-Generate the Tokens')
      }
    }
  }

  // zoho meeting intergaration function to store the responce data in DB.JSON
  const createMeetingInDb = async (data) => {
    messageDrop('success', 'Meeting Created Successfully') // this is showing the message (ANTD)

    // this is for get the current id
    const URL = window.location.pathname
    const endpoint = URL.split('/').pop()

    // this object and below function are storing the meeting seesion data (only successfully created meeting data in ZOHO meeting)
    const sessionData = {
      id: window.location.pathname == "/ScheduleMeeting" ? selectedContact : endpoint, // giving the same contact person id for showing in his/her deatil module
      key: Math.floor(Math.random() * 1000000000),
      session: data.session
    }

    // Logging the meeting
    const loggingMeetignSession = async () => {
      try {
        const URL = `http://localhost:3000/meetingSession` // stoting in this URL
        const posting = await axios.post(URL, sessionData)
        if (posting.status === 201) {
          messageDrop('success', 'Session are stored in meeting log')
        }
      } catch (err) {
        if (err.response) {
          message.error('Error');
        } else if (err.request) {
          message.error('Error: No response from server.');
        } else {
          message.error('Error: ' + err.message);
        }
      }
    }
    loggingMeetignSession()

    // this is for changing the page to actual contact detail module
    setTimeout(() => {
      if (window.location.pathname == "/ScheduleMeeting") {
        navigate("/meetingDetail")
      } else {
        navigate(`/contacts`)
      }
    }, 1 * 100);
  }

  // this is simple back function
  const backFunction = () => {
    if (window.location.pathname == "/editing/ScheduleMeeting") {
      return window.history.back(-1)
    } else if (window.location.pathname == "/ScheduleMeeting") {
      return window.history.back(-1)
    } else {
      navigate(`/contactDetail/detail/${id}`)
    }
  }

  // this function fetch the datas from contact (only when url == schdule meeting)
  const fetching = async () => {
    try {
      const responce = await axios.get('https://crm-server-opal.vercel.app/mongoDB/contacts')
      if (responce.status === 200) {
        setContactData(await responce.data);
      }
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

  useEffect(() => {
    fetching()
  }, [undefined])

  // this for find ,it is creaet meeting for edit meeting .if pathname like this .it can be change as a edit meeting
  const matchDetail = useMatch('/editing/meetingDetail/:id')

  return (
    <div>
      <Dashboard />
      <Row justify={'end'} style={{ paddingTop: '10px', paddingRight: '10px', }}>
        <Space>
          <Link to={`/integrationStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>
          <Button type='primary' onClick={backFunction}> Back one Step </Button>
        </Space>
      </Row>

      {(!Array.isArray(meetingUserDetail) && !Array.isArray(meetingAccessTokenData)) ? <>
        {contactData.length > 0 ? <Title level={3}> Schedule Meeting </Title> : <> </>}
        {matchDetail !== null ? <EditMeeting /> : <>
          {contactData.length > 0 ?
            <Row>
              <form onSubmit={checkForSubmitting}>
                <p>
                  <label for="topic"><span style={required}>* &nbsp;</span>Topic </label>
                  <input type="text" name="topic" id="topic" placeholder={`Topic`} value={meetingData.topic} onChange={handleChange} className={getInputClass('topic') ? "inputError" : 'errorClear'} />
                </p>

                <p>
                  <label for="agenda"> <span style={required}>* &nbsp;</span>Agenda </label>
                  <textarea name="agenda" id="agenda" placeholder='Agenda' value={meetingData.agenda} onChange={handleChange} className={getInputClass('agenda') ? "inputError" : 'errorClear'} />
                </p>

                {window.location.pathname == "/ScheduleMeeting" &&
                  <p>
                    <label for="contact-module"> <span style={required}>* &nbsp;</span>Select Contact Module</label>
                    <select name="contact-module" id="contact-module" value={selectedContact} onChange={(e) => setSelectedContact(e.target.value)}>
                      <option value={''} hidden>select Contact Module</option>
                      {contactData.map((e) => {
                        return <option value={e.id}>{e.firstname}</option>
                      })}
                    </select>
                  </p>
                }

                <p>
                  <label for="statrDate"> <span style={required}>* &nbsp;</span>Date </label>
                  <input type="date" name="statrDate" id="statrDate" placeholder={`start Date `} value={meetingData.statrDate} onChange={handleChange} className={getInputClass('statrDate') ? "inputError" : 'errorClear'} />
                </p>

                <p>
                  <label for="time"> <span style={required}>* &nbsp;</span>Time </label>
                  <input type="time" name="time" id="time" placeholder={`Start Time`} value={meetingData.time} onChange={handleChange} className={getInputClass('time') ? "inputError" : 'errorClear'} />
                </p>

                <p>
                  <label for="meridiem"> <span style={required}>* &nbsp;</span>AM / PM </label>
                  <select name="meridiem" id="meridiem" value={meetingData.meridiem} onChange={handleChange} className={getInputClass('meridiem') ? "inputError" : 'errorClear'} >
                    <option value="" style={{ color: 'red' }}>Select Meridiem</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </p>

                <p>
                  <label for="participantsMail"> <span style={required}>* &nbsp;</span>Host</label>
                  <input type="email" name="participantsMail" id="participantsMail" placeholder={`participantsMail`} value={meetingData.participantsMail} onChange={handleChange} className={getInputClass('participantsMail') ? "inputError" : 'errorClear'} />
                </p>

                <Space>
                  <Button type='default' danger onClick={resetClicked}>Reset</Button>
                  <Button type='primary' onClick={checkForSubmitting}>Submit</Button>
                </Space>
              </form>
            </Row> : <Row justify={'center'}>
              <Col className='OopsContent'>
                <span>
                  <Row justify={'center'}> <Title level={4} className='PoppinsFont'>Oops! Looks like we can’t schedule the meeting without the<span style={{ color: '#5a3bb6', textTransform: 'capitalize' }}> Contact Module! </span></Title></Row>
                  <Link to={'/contacts/formpage'}><Button style={contactButton} className='PoppinsFont' type='primary'>Create Contact</Button></Link>
                  <Row justify={'center'} style={{ marginTop: '-7px' }} > <Title level={4} className='PoppinsFont'> Create atleast <span style={{ color: '#5a3bb6', textTransform: 'uppercase' }}  >one </span>contact</Title></Row>
                </span>
              </Col>
              <Col className='imageStyle'>
                <img src="//www.zohowebstatic.com/sites/zweb/images/thrive/home/acquire.png" />
              </Col>
            </Row>}
        </>}
      </> : <Col style={{height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/one/india/h-creative.webp' height={'200px'} preview={false} /> </Row>
          <Row justify={'center'}> <Title level={5}>  We want <span style={{ color: '#5a3bb6', textTransform: 'capitalize' }}> tokens </span> to schedule zoho meetings </Title></Row>
          <Row justify={'center'}> <Title level={4}>  Click the <span style={{ color: '#5a3bb6' }}> Re-Generate Tokens </span> button to generate new tokens.</Title> </Row>
          {Array.isArray(meetingUserDetail) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho User </span> Token </Row>}
          {Array.isArray(meetingAccessTokenData) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Meeting Access </span> Token </Row>}
        </span>
      </Col>
      }
    </div>
  )
}
export default ScheduleMeeting