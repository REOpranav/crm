import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Col, Image, message, Popconfirm, Row, Space, Tooltip, Typography, Spin } from 'antd'
import axios from 'axios'
import { json, Link, useNavigate } from 'react-router-dom'
import './MailLog.css'
import { CiMail } from "react-icons/ci";
import { MdOutlineAirlineSeatLegroomReduced, MdOutlineDeleteOutline } from "react-icons/md";

// this is for finding the name fron pathname to send  post request in that URL
const URL = window.location.pathname
const id = URL.split('/').pop()

// this is for getting the code (query param) from URL
const urlSearch = new URLSearchParams(window.location.search)
const Authcode = urlSearch.get('code') ?? null

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

const MailLog = () => {
  const navigate = useNavigate();
  const { Title } = Typography

  const [mailList, setMailList] = useState([])
  const [deletingMailMessageID, setDeletingMailMessageID] = useState([])
  const [ZOHOmailFolderID, setZOHOmailFolderID] = useState([])
  const [isLoad, setISload] = useState(true)
  const [folderID, setFolderID] = useState(0)

  // accessing the zoho Mail Account detail from session storage
  const ZOHOmailFoldersDetails = sessionStorage.getItem('mailFolderDetails') || []
  const ZOHOmailMessageAccessToken = sessionStorage.getItem('ZOHOmailMessageAccessToken') || []
  const ZOHOmailAccountdID = sessionStorage.getItem('ZOHOmailAccountID') || []
  const ZOHOmailAccountDetailResponceAccountName = sessionStorage.getItem('ZOHOmailAccountDetailResponceAccountName') || []
  const ZOHOmailAccountDetailResponcePrimaryEmailAddress = sessionStorage.getItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress') || []

  // this code are ZOHO MAIL intregreation codes 
  const fetchedDataFromZOHOmailFOlder = async (token) => { // if account Token will get ,stored in session storage    
    sessionStorage.setItem('mailFolderDetails', JSON.stringify(token)) // stroing the api data in sessiong storage
    const checkmailAccountdDetailForDropMessage = await JSON.parse(sessionStorage.getItem('mailFolderDetails')) || [] //checking if there have meetingAccessTokenData in session storage for showing the success message
    checkmailAccountdDetailForDropMessage !== null ? message.success('Mail Folder Detail Retrieved') : message.warning('Failed to retrive,Pleace Retry the same process')
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const getZOHOmailAccountIDdetail = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
    }

    try {
      const ZOHOmailAccountDetailResponce = await axios.post(`http://localhost:3002/api/mailAccountToken`, accessTokenParams) // this line send the request to node (server.js)   
      ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails[0]?.accountId && messageDrop('success', 'Account Details getted')
      ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails.status === 200 && messageDrop('success', 'Account detail Got successfully')
      if (ZOHOmailAccountDetailResponce?.data?.getZOHOmeetingAccessToken?.scope == 'ZohoMail.accounts.ALL') {
        sessionStorage.setItem('ZOHOmailAccountID', JSON.stringify(ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails[0]?.accountId))
        sessionStorage.setItem('ZOHOmailAccountDetailResponceAccountName', JSON.stringify(ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails[0]?.accountName))
        sessionStorage.setItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress', JSON.stringify(ZOHOmailAccountDetailResponce.data?.fecthingZOHOmeetingAccountDetails[0]?.primaryEmailAddress))
      }
      setTimeout(() => {
        navigate('/maillog') // this is for getting out of that section
      }, 100);
    } catch (err) {
      console.log(err.message);
    }
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const ZOHOmailFolderDetail = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
      ZOHOmailAccountID: ZOHOmailAccountdID && JSON.parse(ZOHOmailAccountdID)
    }

    try {
      const folderTokenResponce = await axios.post(`http://localhost:3002/api/mailFolder`, accessTokenParams) // this line send the request to node (server.js)
      if (folderTokenResponce?.data?.getZOHOfolderAccessToken?.scope == "ZohoMail.folders.ALL") {
        fetchedDataFromZOHOmailFOlder(folderTokenResponce?.data?.getZOHOfolderDetails)
      }
      setTimeout(() => {
        navigate('/maillog') // this is for getting out of that section
      }, 100);
    } catch (err) {
      console.log(err.message)
    }
  }

  const getZOHOmailMessageAccessToken = async () => {
    let accessTokenParams = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
    }

    try {
      const ZOHOmailMessageDetailResponce = await axios.post(`http://localhost:3002/api/ZOHOmailMessageAccessToken`, accessTokenParams) // this line send the request to node (server.js)
      ZOHOmailMessageDetailResponce.data.scope === "ZohoMail.messages.ALL" && sessionStorage.setItem('ZOHOmailMessageAccessToken', JSON.stringify(ZOHOmailMessageDetailResponce?.data?.access_token)) // this code is accesstoken relevent code
      setTimeout(() => {
        navigate('/maillog')
      }, 100);
    } catch (err) {
      console.log(err.message);

    }
  }

  // this function is get the current mail list
  const currentZOHOmailList = () => {
    if (!Array.isArray(JSON.parse(ZOHOmailMessageAccessToken)) && !Array.isArray(JSON.parse(ZOHOmailAccountdID))) {
      const mailAccessCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "mailAccountID": ZOHOmailAccountdID ? JSON.parse(ZOHOmailAccountdID) : 0,
            "mailFolderID": ZOHOmailFolderID ? ZOHOmailFolderID : 0,
            "mailAccess_token": `${ZOHOmailMessageAccessToken}`,
          }
        }
        try {
          const mailListResponce = await axios.post(`http://localhost:3002/api/mailList`, extras)// this line send the request to node (server.js)          
          if (mailListResponce?.status == 200) {
            setMailList(mailListResponce?.data)
          }
        } catch (err) {
          if (err.message == "Request failed with status code 500") {
            messageDrop('warning', 'Re-Generate the Tokens')
          }
        }
      }
      mailAccessCredencial()
    }
  }

  // this function is delete the ZOHO MAIL
  const ZOHOmailDelete = (ZOHOmessageID) => {
    if (!Array.isArray(JSON.parse(ZOHOmailMessageAccessToken)) && !Array.isArray(JSON.parse(ZOHOmailAccountdID))) {
      const MailDeleteCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "mailAccountID": ZOHOmailAccountdID ? JSON.parse(ZOHOmailAccountdID) : 0,
            "mailFolderID": ZOHOmailFolderID ? ZOHOmailFolderID : 0,
            "mailAccess_token": `${ZOHOmailMessageAccessToken}`,
            "deletingMailFolder_ID": ZOHOmessageID && ZOHOmessageID
          }
        }
        try {
          const mailListResponce = await axios.post(`http://localhost:3002/api/maildelete`, extras)// this line send the request to node (server.js)
          if (mailListResponce.status == 200) {
            messageDrop('success', 'Deleted successfully')
            currentZOHOmailList()
          }
        } catch (err) {
          console.log(err.message);
        }
      }
      MailDeleteCredencial()
    }
  }

  // this is for parsing the all JSON data to normal data
  const parsingFunction = (data) => {
    return data.length > 0 ? JSON.parse(data) : ""
  }

  const sendFolderID = (folderID) => {  // Getting spacific Mail Folder ID 
    setISload(true)
    setZOHOmailFolderID(folderID)
    setFolderID(folderID)
  }

  const mailMessageID = (messageID) => {
    setISload(true)
    ZOHOmailDelete(messageID)
  }

  useEffect(() => { // checking if the userdetail and accesstoken is available or not.if available ,then only this useeffect will run
    if (!Array.isArray(ZOHOmailMessageAccessToken) && !Array.isArray(ZOHOmailAccountdID)) {
      currentZOHOmailList()
    }
  }, [undefined])

  if (isLoad) {
    if (!Array.isArray(ZOHOmailMessageAccessToken) && !Array.isArray(ZOHOmailAccountdID)) {
      currentZOHOmailList()
    }
    setISload(false)
  }

  const KBvalue = (dataSize) => { // finding normal valuw to KB value 
    const KB = Number(dataSize) / 1024
    return `${KB.toFixed(0)} KB`
  }

  useEffect(() => { // this useeffect for load the access token function when code is available in url 
    if (Authcode !== null) {
      // getZOHOmailAccountIDdetail()
      ZOHOmailFolderDetail()
      getZOHOmailMessageAccessToken()
    }
  }, [undefined])

  const back = () => window.history.back() // this is for back one step
  let mailFolderData = !Array.isArray(ZOHOmailFoldersDetails) ? parsingFunction(ZOHOmailFoldersDetails) : [] // this send this mail data  

  console.log(folderID);

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} >
        <Space style={{ paddingLeft: '10px' }}>
          <Title level={3} style={{ fontWeight: 'lighter', color: 'red' }}> Mail Log <span style={{ color: 'gray', fontSize: 'small', fontWeight: '400', fontStyle: 'italic' }}>{`${parsingFunction(ZOHOmailAccountDetailResponcePrimaryEmailAddress) ?? ''}`}</span></Title>
        </Space>
        <Space style={{ marginRight: '10px' }}>
          <Link to={'/mailsend'}><Button type='primary' style={{ width: '305px' }} >Send mail</Button></Link>{/* we want to create a send mail code */}
        </Space>
      </Row>
      <Row justify={'space-between'} style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}>
        <Col span={16}>
          <Row className='mailFolderOuterBox' justify={'space-around'}>
            {Array.isArray(mailFolderData) && mailFolderData.length > 0 && mailFolderData?.map(e =>
              <Col className='Mailfolders' onClick={() => sendFolderID(e?.folderId)}> <span> {e.folderId == folderID ?? 0 ? <span style={{ color: 'blueviolet', transition: 'all 0.3s ease-in-out' }}>{e?.folderName}</span> : e?.folderName} </span></Col>
            )}
          </Row>
        </Col>
        <Col span={6}>
          <Space>
            <Link to={`/integrationStep`}> <Button type='default'>Re-Generate the Tokens</Button> </Link>
            <Button type='primary' onClick={back}>Back one Step</Button>
          </Space>
        </Col>
      </Row>
      {!Array.isArray(ZOHOmailAccountdID) && !Array.isArray(ZOHOmailFoldersDetails) && !Array.isArray(ZOHOmailMessageAccessToken) ?
        <Row style={{ minHeight: "65vh", maxHeight: '65vh', overflow: 'auto', marginTop: '20px' }} justify={'center'}>
          <Col span={23}>
            {!Array.isArray(mailList) && (mailList?.data.length > 0) ? (mailList?.data).map((data) => {
              return <Row className='mailDataStyle'>
                <Col span={1}><CiMail className='ZOHOmailLOGO' /></Col>
                <Col span={5} className='mailDataFromAddress'><Row style={{ maxWidth: '90%' }} className='mailDataFromAddress'>{data.subject}</Row></Col>
                <Col span={17}><Row justify={'center'}> <Col span={20} className='mailDataSummuryStyle'>{data.summary}</Col> <Col span={4} className='mailDataKB'>{KBvalue(data.size)}</Col></Row></Col>
                <Col span={1} style={{ textAlign: 'left' }}><MdOutlineDeleteOutline className='ZOHOmailDelete' onClick={() => mailMessageID(data.messageId)} /></Col>
              </Row>
            }) :
              <Row justify={'center'} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <Col>
                  <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/mail/custom-domain-illustration-2x.png' height={'150px'} preview={false} /></Row>
                  <Row justify={'center'}> <Col> <Row justify={'center'} className='no-meeting-message-style'>Unfortunately, no messages are currently available in this module.</Row></Col></Row>
                </Col>
              </Row>
            }
          </Col>
        </Row>
        : <>
          <Col style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: '' }}>
            <span>
              <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/social/real-estate/zh-real-estate.png' height={'200px'} preview={false} /></Row>
              <Row justify={'center'}> <Title level={4}>  Click the <span style={{ color: '#5a3bb6' }}> Re-Generate Tokens </span> button to generate new tokens.</Title> </Row>
              {Array.isArray(ZOHOmailAccountdID) && <Row className='PoppinsFont'> <Col span={7} style={{ textAlign: 'right' }}>1.</Col> <Col span={17} style={{ textAlign: 'left' }}>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Account Access </span> Token</Col> </Row>}
              {Array.isArray(ZOHOmailFoldersDetails) && <Row className='PoppinsFont'><Col span={7} style={{ textAlign: 'right' }}>2.</Col> <Col span={17} style={{ textAlign: 'left' }}>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Folder Access </span> Token</Col> </Row>}
              {Array.isArray(ZOHOmailMessageAccessToken) && <Row className='PoppinsFont'><Col span={7} style={{ textAlign: 'right' }}>3.</Col> <Col span={17} style={{ textAlign: 'left' }}>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Message Access </span> Token</Col> </Row>}
            </span>
          </Col>
        </>}
    </div>
  )
}

export default MailLog