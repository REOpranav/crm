import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Col, Image, message, Popconfirm, Row, Space, Tooltip, Typography, Spin } from 'antd'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './MailLog.css'
import { CiMail } from "react-icons/ci";
import { MdOutlineAirlineSeatLegroomReduced, MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineClose } from 'react-icons/ai'
import { RxArrowLeft } from "react-icons/rx";
import SendMail from './SendMail'
import ZOHOIndividualReplyMail from './ZOHOIndividualReplyMail'
import { getZohoAccessToken_Params } from 'api-auth-zoho'

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

const replyHeading = {
  padding: '10px'
}

let autharizationCode = Authcode
let client_id = process.env.REACT_APP_MAIL_CLIENT_ID
let client_secret = process.env.REACT_APP_MAIL_SECRET_ID
let redirect_uri = process.env.REACT_APP_MAIL_REDIRECT_URI
let grant_type = 'authorization_code'
let accessTokenParams = getZohoAccessToken_Params(autharizationCode, client_id, client_secret, redirect_uri, grant_type)


const MailLog = () => {
  const navigate = useNavigate();
  const { Title } = Typography

  const [mailList, setMailList] = useState([])
  const [deletingMailMessageID, setDeletingMailMessageID] = useState([])
  const [ZOHOmailFolderID, setZOHOmailFolderID] = useState([])
  const [isLoad, setISload] = useState(true)
  const [profilView, setProfileView] = useState(false)
  const [individualMailMessage_content, setIndividualMailMessage_content] = useState([])
  const [individualMailMessage_details, setTndividualMailMessage_details] = useState([])
  const [zohoIndividualReplyMail, setZohoIndividualReplyMail] = useState(false)
  const [zohoIndividualReplyAllMail, setZohoIndividualReplyAllMail] = useState(false)
  const [zohoIndividualForwardMail, setZohoIndividualForwardMail] = useState(false)
  const individual = document.getElementById('individualMessage')

  // accessing the zoho Mail Account detail from session storage
  const ZOHOmailFoldersDetails = JSON.parse(sessionStorage.getItem('mailFolderDetails')) || []
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

  // meeting codes (get user token)
  // this function is getting the user define in zoho meeting
  const userdefine = async () => {
    try {
      const accessTokenResponce = await axios.post(`https://crm-server-opal.vercel.app/api/userdetail`, accessTokenParams) // this line send the request to node (server.js)                
      userDeatailAuth(accessTokenResponce?.data)
    } catch (err) {
      console.log(err.message)
    }
  }

  // if user datail are get ,it store in session storage
  const userDeatailAuth = (token) => {
    sessionStorage.setItem('userdatail', JSON.stringify(token)) // stroing thr api data in sessiong storage
    const meetingUserDetail = JSON.parse(sessionStorage.getItem('userdatail')) ?? []
    meetingUserDetail !== null && message.success('User Token Retrieved') //checking if there have meetingUserDetail for showing the success message
    setTimeout(() => {
      navigate('/maillog') // this is for getting out of that section
    }, 100)
  }

  // meeting codes (get access token)
  // this function is getting the access token
  const ZOHO_Meeting_Access_Token = async () => {
    try {
      const accessTokenResponce = await axios.post(`https://crm-server-opal.vercel.app/api/token`, accessTokenParams) // this line send the request to node (server.js)      
      if (accessTokenResponce?.data?.scope == 'ZohoMeeting.meeting.ALL') {
        accessTokenData(accessTokenResponce?.data)

        setTimeout(() => {
          navigate('/maillog') // this is for getting out of that section
        }, 300);
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

  // if accesstoken are getted ,stored in session storage
  const accessTokenData = (token) => {
    sessionStorage.setItem('accessToken', JSON.stringify(token)) // stroing thr api data in sessiong storage
    const meetingAccessTokenData = JSON.parse(sessionStorage.getItem('accessToken')) ?? []  //checking if there have meetingAccessTokenData in session storage for showing the success message
    meetingAccessTokenData !== null && message.success('Access Token Retrieved')
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const getZOHOmailAccountIDdetail = async () => {
    try {
      const ZOHOmailAccountDetailResponce = await axios.post(`https://crm-server-opal.vercel.app/api/mailAccountToken`, accessTokenParams) // this line send the request to node (server.js)   

      if (ZOHOmailAccountDetailResponce?.data?.getZOHOmeetingAccessToken?.scope == 'ZohoMail.accounts.ALL') {
        sessionStorage.setItem('ZOHOmailAccountID', ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails[0]?.accountId)
        sessionStorage.setItem('ZOHOmailAccountDetailResponceAccountName', ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails[0]?.accountName)
        sessionStorage.setItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress', ZOHOmailAccountDetailResponce.data?.fecthingZOHOmeetingAccountDetails[0]?.primaryEmailAddress)

        ZOHOmailAccountDetailResponce?.data?.fecthingZOHOmeetingAccountDetails[0]?.accountId && messageDrop('success', 'Account Details getted')

        setTimeout(() => {
          navigate('/maillog') // this is for getting out of that section
        }, 100);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // this function is getting the zoho mail Account detail (Account ID) 
  const ZOHOmailFolderDetail = async () => {
    let accessTokenParameter = {
      code: Authcode,
      client_id: process.env.REACT_APP_MAIL_CLIENT_ID,
      client_secret: process.env.REACT_APP_MAIL_SECRET_ID,
      redirect_uri: process.env.REACT_APP_MAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
      ZOHOmailAccountID: ZOHOmailAccountdID && ZOHOmailAccountdID
    }

    try {
      const folderTokenResponce = await axios.post(`https://crm-server-opal.vercel.app/api/mailFolder`, accessTokenParameter) // this line send the request to node (server.js)
      folderTokenResponce?.data?.getZOHOfolderAccessToken?.scope == "ZohoMail.folders.ALL" && (() => {
        fetchedDataFromZOHOmailFOlder(folderTokenResponce?.data?.getZOHOfolderDetails)
        setTimeout(() => {
          navigate('/maillog') // this is for getting out of that section
        }, 100);
      })()
    } catch (err) {
      console.log(err.message)
    }
  }

  const getZOHOmailMessageAccessToken = async () => {
    try {
      const ZOHOmailMessageDetailResponce = await axios.post(`https://crm-server-opal.vercel.app/api/ZOHOmailMessageAccessToken`, accessTokenParams) // this line send the request to node (server.js)      
      ZOHOmailMessageDetailResponce?.data?.scope === "ZohoMail.messages.ALL" && (() => {
        sessionStorage.setItem('ZOHOmailMessageAccessToken', ZOHOmailMessageDetailResponce?.data?.access_token)
        setTimeout(() => {
          navigate('/maillog')
        }, 100);
      })()
    } catch (err) {
      console.log(err.message);
    }
  }

  // this function is get the current mail list
  const currentZOHOmailList = () => {
    if (!Array.isArray(ZOHOmailMessageAccessToken) && !Array.isArray(ZOHOmailAccountdID)) {
      const mailAccessCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "mailAccountID": ZOHOmailAccountdID ? `${ZOHOmailAccountdID}` : 0,
            "mailFolderID": ZOHOmailFolderID ? ZOHOmailFolderID : 0,
            "mailAccess_token": ZOHOmailMessageAccessToken,
          }
        }
        try {
          const mailListResponce = await axios.post(`https://crm-server-opal.vercel.app/api/mailList`, extras)// this line send the request to node (server.js)          
          mailListResponce?.status == 200 && (() => {
            setMailList(mailListResponce?.data)
          })()
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
    if (!Array.isArray(ZOHOmailMessageAccessToken) && !Array.isArray(ZOHOmailAccountdID)) {
      const MailDeleteCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "mailAccountID": ZOHOmailAccountdID ? ZOHOmailAccountdID : 0,
            "mailFolderID": ZOHOmailFolderID ? ZOHOmailFolderID : 0,
            "mailAccess_token": ZOHOmailMessageAccessToken,
            "deletingMailFolder_ID": ZOHOmessageID && ZOHOmessageID
          }
        }
        try {
          const mailListResponce = await axios.post(`https://crm-server-opal.vercel.app/api/maildelete`, extras)// this line send the request to node (server.js)
          mailListResponce.status == 200 && (() => {
            messageDrop('success', 'Deleted successfully')
            currentZOHOmailList()
          })()
        } catch (err) {
          console.log(err.message);
        }
      }
      MailDeleteCredencial()
    }
  }

  // this code listing the Email
  const ZOHOmailListIndividualMessage = (ZOHOmessageID) => {
    if (!Array.isArray(ZOHOmailMessageAccessToken) && !Array.isArray(ZOHOmailAccountdID)) {
      const listMailCredencial = async () => {
        const extras = { // This is params,sending to backend for important extra information like zoho org ID and Access Token
          "session": {
            "mailAccountID": ZOHOmailAccountdID ? ZOHOmailAccountdID : 0,
            "mailFolderID": ZOHOmailFolderID ? ZOHOmailFolderID : 0,
            "mailAccess_token": ZOHOmailMessageAccessToken,
            "showZOHOMailMessage": ZOHOmessageID && ZOHOmessageID
          }
        }
        try {
          const mailIndividualResponce = await axios.post(`https://crm-server-opal.vercel.app/api/mailDataIndividual`, extras)// this line send the request to node (server.js)
          if (mailIndividualResponce.status == 200) {
            setIndividualMailMessage_content(mailIndividualResponce?.data?.content)
            setTndividualMailMessage_details(mailIndividualResponce?.data?.detail)
          }
        } catch (err) {
          console.log(err.message);
        }
      }
      listMailCredencial()
    }
  }

  // this is for parsing the all JSON data to normal data
  const parsingFunction = (data) => {
    return data.length > 0 ? data : ""
  }

  const sendFolderID = (folderID) => {  // Getting spacific Mail Folder ID 
    setISload(true)
    setProfileView(false) // closong rhe preview (message showing in side)
    setZOHOmailFolderID(folderID)
    setFolderID(folderID)
  }

  const ccAddressCovertToHumanReadable = (ccAddesss) => { // this is for convert cc address to normal human readable email string    
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(ccAddesss, 'text/html').body.textContent;

    // Extract email address using a regular expression
    if (decodedString == 'Not Provided') {
      return decodedString
    } else {
      const email = decodedString && decodedString.match(/<(.+?)>/)[1];
      return email
    }
  }

  const KBvalue = (dataSize) => { // finding normal value to KB value in mail list
    const KB = Number(dataSize) / 1024
    return `${KB.toFixed(0)} KB`
  }

  const mailMessageIDForDelete = (messageID) => {
    setISload(true)
    ZOHOmailDelete(messageID)
  }

  const mailMessageIDForShowParticularMail = (messageID) => {
    ZOHOmailListIndividualMessage(messageID)
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

  useEffect(() => {
    if (Authcode !== null) {
      // userdefine() // meeting user account
    }
  }, [undefined])

  useEffect(() => {
    if (Authcode !== null) {
      // ZOHO_Meeting_Access_Token() // meeting access token
    }
  }, [undefined])

  useEffect(() => { // mail access tokens 
    if (Authcode !== null) {
      getZOHOmailAccountIDdetail()
      ZOHOmailFolderDetail()
      getZOHOmailMessageAccessToken()
    }
  }, [undefined])

  const profileViewTrue = () => {
    setProfileView(true)  // set true for profile view (individual message view = true)

    // making the state false for hide it 
    setZohoIndividualReplyMail(false)
    setZohoIndividualReplyAllMail(false)
    setZohoIndividualForwardMail(false)
  }

  const profileView = () => {
    setProfileView(!profilView)

    // making the state false for hide it
    setZohoIndividualReplyMail(false)
    setZohoIndividualReplyAllMail(false)
    setZohoIndividualForwardMail(false)
  }
  const back = () => window.history.back() // this is for back one step
  let mailFolderData = parsingFunction(ZOHOmailFoldersDetails) // this send this mail data  
  const [folderID, setFolderID] = useState(mailFolderData ? mailFolderData[0]?.folderId : 0)

  individual !== null && (individual.innerHTML = individualMailMessage_content?.data?.content)

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

      {!Array.isArray(ZOHOmailAccountdID) && Array.isArray(ZOHOmailFoldersDetails) && !Array.isArray(ZOHOmailMessageAccessToken) ?
        <Row style={{ minHeight: "65vh", maxHeight: '65vh', overflow: 'auto', marginTop: '20px' }} justify={'center'}>
          <Col span={23}>
            {profilView && !Array.isArray(individualMailMessage_content) && // this code for showing the individual mail message when they click the messages in mailLog
              <Row className={profilView && 'sideBarOpen'}>
                <Col span={24} style={{ color: 'black' }} >
                  <Row className='mailHeaders'>
                    <Col span={24} >
                      <Row id='closeProfileTab' onClick={() => profileView()}> <p> <RxArrowLeft size={20} color='grey' className='closingTabArrow' /></p></Row>
                      <Row justify={'center'} className='subject'><span >{individualMailMessage_details?.data?.subject}</span></Row>
                      <Row justify={'center'} className='fromAddress'>From : {individualMailMessage_details?.data?.fromAddress}</Row>
                      <Row justify={'center'} className='ccAddress'>ccAddress : {individualMailMessage_details?.data?.ccAddress ? ccAddressCovertToHumanReadable(individualMailMessage_details?.data?.ccAddress) : '-'}</Row>
                    </Col>
                  </Row>

                  <Row justify={'start'} className='summaryHead'>Summary :</Row>
                  <Row><div id='individualMessage'></div></Row>
                  <Row justify={'start'} className='ExtrasFeatures'>
                    <Col onClick={() => { setZohoIndividualReplyAllMail(false); setZohoIndividualForwardMail(false); setZohoIndividualReplyMail(true) }}> <span className='reply'>Reply</span></Col>
                    <Col onClick={() => { setZohoIndividualReplyMail(false); setZohoIndividualForwardMail(false); setZohoIndividualReplyAllMail(true) }} style={{ marginLeft: '20px' }}> <span className='replyAll'>Reply All</span></Col>
                    <Col onClick={() => { setZohoIndividualReplyMail(false); setZohoIndividualReplyAllMail(false); setZohoIndividualForwardMail(true) }} style={{ marginLeft: '20px' }}> <span className='forward'> Forward</span></Col>
                  </Row>


                  {zohoIndividualReplyMail &&
                    <Row className={zohoIndividualReplyMail && 'zohoIndividualReplyMail'}>
                      <Col span={24}>
                        <Row justify={'center'} style={{ textTransform: '' }}>Reply :</Row>
                        <ZOHOIndividualReplyMail
                          toAddress={individualMailMessage_details?.data?.fromAddress} // while sending reply message from address change into to address
                          messageID={individualMailMessage_details?.data?.messageId}
                          subject={individualMailMessage_details?.data?.subject}
                          setReplySendStatus={setProfileView}
                        />
                      </Col>
                    </Row>
                  }
                  {zohoIndividualReplyAllMail &&
                    <Row>
                      <Col span={24}>
                        <Row justify={'center'} style={replyHeading}>REPLY ALL :</Row>
                        <ZOHOIndividualReplyMail
                          toAddress={individualMailMessage_details?.data?.fromAddress} // while sending reply message from address change into to address
                          messageID={individualMailMessage_details?.data?.messageId}
                          subject={individualMailMessage_details?.data?.subject}
                          ccAddress={ccAddressCovertToHumanReadable(individualMailMessage_details?.data?.ccAddress) !== 'Not Provided' ? ccAddressCovertToHumanReadable(individualMailMessage_details?.data?.ccAddress) : ''}
                          setReplySendStatus={setProfileView}
                        />
                      </Col>
                    </Row>
                  }
                  {zohoIndividualForwardMail &&
                    <Row>
                      <Col span={24}>
                        <Row justify={'center'} style={replyHeading}>FORWARD :</Row>
                        <ZOHOIndividualReplyMail
                          toAddress={individualMailMessage_details?.data?.fromAddress} // while sending reply message from address change into to address
                          messageID={individualMailMessage_details?.data?.messageId}
                          subject={individualMailMessage_details?.data?.subject}
                          content={individualMailMessage_details?.data?.summary}
                          setReplySendStatus={setProfileView}
                        />
                      </Col>
                    </Row>
                  }
                </Col>
              </Row>
            }

            {!Array.isArray(mailList) && (mailList?.data?.length > 0) ? (mailList?.data).map((data) => { // this code for showing the mail message data in list             
              return <Row className='mailDataStyle'>
                <Col span={24}>
                  <Row>
                    <Col span={23} onClick={() => { profileViewTrue(); mailMessageIDForShowParticularMail(data?.messageId) }}>
                      <Row>
                        <Col span={1}><CiMail className='ZOHOmailLOGO' /></Col>
                        <Col span={5} className='mailDataFromAddress'><Row style={{ maxWidth: '90%' }} className='mailDataFromAddress'>{data.subject}</Row></Col>
                        <Col span={18}><Row justify={'center'}> <Col span={20} className='mailDataSummuryStyle'>{data.summary}</Col> <Col span={4} className='mailDataKB'>{KBvalue(data.size)}</Col></Row></Col>
                      </Row>
                    </Col>
                    <Col span={1} style={{ textAlign: 'left' }}>
                      <Row justify={'center'}> <MdOutlineDeleteOutline className='ZOHOmailDelete' onClick={() => mailMessageIDForDelete(data?.messageId)} /> </Row>
                    </Col>
                  </Row>
                </Col>
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
        </Row >
        : <>
          <Col style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>

              <Row justify={'center'}> <Image src='https://www.zohowebstatic.com/sites/zweb/images/social/real-estate/zh-real-estate.png' height={'200px'} preview={false} /></Row>
              <Row justify={'center'}> <Title level={4}>  Click the <span style={{ color: '#5a3bb6' }}> Re-Generate Tokens </span> button to generate new tokens.</Title> </Row>
              {Array.isArray(ZOHOmailAccountdID) && <Row className='PoppinsFont'> <Col span={7} style={{ textAlign: 'right' }}>1.</Col> <Col span={17} style={{ textAlign: 'left' }}>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Account Access </span> Token</Col> </Row>}
              {ZOHOmailFoldersDetails.length <= 0 && <Row className='PoppinsFont'><Col span={7} style={{ textAlign: 'right' }}>2.</Col> <Col span={17} style={{ textAlign: 'left' }}>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Folder Access </span> Token</Col> </Row>}
              {Array.isArray(ZOHOmailMessageAccessToken) && <Row className='PoppinsFont'><Col span={7} style={{ textAlign: 'right' }}>3.</Col> <Col span={17} style={{ textAlign: 'left' }}>Generate <span style={{ color: 'red', marginLeft: '5px', marginRight: '5px' }}>Zoho Message Access </span> Token</Col> </Row>}
            </span>
          </Col>
        </>}
    </div >
  )
}

export default MailLog