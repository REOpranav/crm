import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Col, Image, message, Row, Space, Typography } from 'antd'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './MailLog.css'

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

const required = {
  color: 'red'
}

const URL = window.location.href
const id = URL.split('/').pop()

const SendMail = () => {
  const { Text, Title } = Typography
  const navigate = useNavigate();
  const [sendLeadMail, setSendMailSend] = useState('')
  const ZOHOmailAccountDetailResponcePrimaryEmailAddress = sessionStorage.getItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress') || []
  const ZOHOmailMessageAccessToken = sessionStorage.getItem('ZOHOmailMessageAccessToken') || []
  const ZOHOmailAccountdID = sessionStorage.getItem('ZOHOmailAccountID') || []
  const [error, setError] = useState([])
  const [mailData, setMailData] = useState({ //storing the form data in this state
    fromAddress: '',
    toAddress: sendLeadMail ? sendLeadMail : '',
    ccAddress: '',
    subject: '',
    content: '',
  })  

 const fecthingLeadDetailForMail = async () => { // this code for initial load and when lead added
    try {
      const responce = await axios.get(`http://localhost:3000/leads/${id}`)
      if (responce.status === 200) {
        setSendMailSend(await responce.data.email);
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

  // this is reset function
  const resetClicked = () => {
    setMailData({
      fromAddress: '',
      toAddress: sendLeadMail ? sendLeadMail : '',
      ccAddress: '',
      subject: '',
      content: '',
    })
  }

  // this is handle chanhge function
  const handleChange = (e) => {
    const { name, value } = e.target
    setMailData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  //checking tthe form fileds are filled or not
  function checkForSubmitting(e) {
    let checkHavingErrorInInputField = Object.keys(validation(mailData)).length === 0 // if it was greater than 0 that mean not fill the manditory field
    if (checkHavingErrorInInputField) {
      onFinish(e)
    } else {
      setError(validation(mailData))
      message.error('Fill the Manditory Form Fields')
    }
  }

  // Form validation
  function validation(mailData) {
    let errorvalues = {}

    if (!sendLeadMail) {
      if (!mailData.toAddress.trim()) {
        errorvalues.toAddress = 'To-Address is Required'
      }
    }

    if (!mailData.subject.trim()) {
      errorvalues.subject = 'Subject is Required'
    }

    if (!mailData.content.trim()) {
      errorvalues.content = 'Content is Required'
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
    sendMail()
  }

  const sendMail = () => {    
    if (!Array.isArray(ZOHOmailMessageAccessToken)) {
      const mailAccessCredencial = async () => {
        const data = {
          "details": {
            "fromAddress": `${ZOHOmailAccountDetailResponcePrimaryEmailAddress}`,
            "toAddress": `${sendLeadMail ? sendLeadMail : mailData.toAddress}`,
            "ccAddress": `${mailData.ccAddress}`,
            "subject": `${mailData.subject}`,
            "content": `${mailData.content}`,
          }
        }

        // this is params,sending to backend for important extra information like zoho MAIL account ID and MAIL Access Token
        const extras = {
          "params": {
            "extras": {
              "accountId": ZOHOmailAccountdID && ZOHOmailAccountdID,
              "access_token": ZOHOmailMessageAccessToken,
            }
          }
        }

        try {
          const mailSendResponce = await axios.post(`http://localhost:3002/api/sendMail`, data, extras)// this line send the request to node (server.js) 
          if (mailSendResponce.data.status.code == 200) {
            messageDrop('success', 'Message sent successfully')
            navigate('/maillog')
          }
        } catch (err) {
          messageDrop('warning', 'Failed to send message')
        }
      }
      mailAccessCredencial()
    }
  }

  const backFunction = () => {
    return window.history.back(-1)
  }

  useEffect(() => {
    if ((window.location.pathname).includes('lead')) {
      fecthingLeadDetailForMail()
      // from contact
    }
  }, [undefined])


  return (
    <div>
      <Dashboard />
      <Row justify={'end'} style={{ paddingTop: '10px', paddingRight: '10px', }}>
        <Space>
          <Link to={`/integrationStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>
          <Button type='primary' onClick={backFunction}> Back one Step </Button>
        </Space>
      </Row>

      {!Array.isArray(ZOHOmailMessageAccessToken) ? <>
        <Title level={3}> Send Mail </Title>
        <Row>
          <form onSubmit={checkForSubmitting}>
            <p>
              <label for="fromAddress"><span style={required}>* &nbsp;</span>From-Address </label>
              <input type="email" name="fromAddress" id="fromAddress" placeholder={`From Address`} value={ZOHOmailAccountDetailResponcePrimaryEmailAddress} onChange={handleChange} style={{ color: 'grey' }} />
            </p>

            <p>
              <label for="toAddress"> <span style={required}>* &nbsp;</span>To-Address</label>
              <input type='email' name="toAddress" id="toAddress" placeholder='To Address' value={sendLeadMail ? sendLeadMail : mailData.toAddress} onChange={handleChange} className={getInputClass('toAddress') ? "inputError" : 'errorClear'} />
            </p>

            <p>
              <label for="subject"> <span style={required}>* &nbsp;</span>Subject </label>
              <input type="text" name="subject" id="subject" placeholder={`subject`} value={mailData.subject} onChange={handleChange} className={getInputClass('subject') ? "inputError" : 'errorClear'} />
            </p>

            <p>
              <label for="content"> <span style={required}>* &nbsp;</span>Content </label>
              <textarea name="content" id="content" placeholder='content' value={mailData.content} onChange={handleChange} className={getInputClass('content') ? "inputError" : 'errorClear'}></textarea>
            </p>

            <p>
              <label for="statrDate"> <span style={required}> &nbsp;</span>ccAddress</label>
              <input type="text" name="ccAddress" id="ccAddress" placeholder={`ccAddress`} value={mailData.ccAddress} onChange={handleChange} />
            </p>
            <Space>
              <Button type='default' danger onClick={resetClicked}>Reset</Button>
              <Button type='primary' onClick={checkForSubmitting}>Submit</Button>
            </Space>
          </form>
        </Row></> : <>
        <Col className='IndicateMessageForGetAccessToken'>
          <span>
            <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/social/marketing-agencies/banner.png' height={'200px'} preview={false} /> </Row>
            <Row justify={'center'}> <Title level={5}>  We want <span style={{ color: '#5a3bb6', textTransform: 'capitalize' }}> tokens </span> to Send zoho mail </Title></Row>
            <Row justify={'center'}> <Title level={4}>  Click the <span style={{ color: '#5a3bb6' }}> Re-Generate Tokens </span> button to generate new tokens.</Title> </Row>
            {/* {Array.isArray(meetingUserDetail) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho User </span> Token </Row>} */}
            {Array.isArray(ZOHOmailMessageAccessToken) && <Row justify={'center'} className='PoppinsFont'>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Mail Message Access </span> Token </Row>}
          </span>
        </Col>
      </>}
    </div>
  )
}

export default SendMail