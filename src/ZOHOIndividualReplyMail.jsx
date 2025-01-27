import { Button, Col, Image, message, Row, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import axios from 'axios'


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

const greyColor = {
    color: '#8C92AC',
    fontStyle: 'italic'
}

const URL = window.location.href
const id = URL.split('/').pop()

const ZOHOIndividualReplyMail = ({ toAddress, messageID, subject, ccAddress, setReplySendStatus, content }) => {
    const { Text, Title } = Typography
    const navigate = useNavigate();
    const ZOHOmailAccountDetailResponcePrimaryEmailAddress = sessionStorage.getItem('ZOHOmailAccountDetailResponcePrimaryEmailAddress') || []
    const ZOHOmailMessageAccessToken = sessionStorage.getItem('ZOHOmailMessageAccessToken') || []
    const ZOHOmailAccountdID = sessionStorage.getItem('ZOHOmailAccountID') || []
    const [error, setError] = useState([])
    const [mailData, setMailData] = useState({ //storing the form data in this state
        fromAddress: ZOHOmailAccountDetailResponcePrimaryEmailAddress ?? '',
        toAddress: toAddress ? toAddress : '',
        ccAddress: ccAddress ? ccAddress : '',
        subject: '',
        content: content ? content : '',
    })

    // this is reset function
    const resetClicked = () => {
        setMailData({
            fromAddress: ZOHOmailAccountDetailResponcePrimaryEmailAddress ?? '',
            toAddress: toAddress ? toAddress : '',
            ccAddress: ccAddress ? ccAddress : '',
            subject: '',
            content: content ? content : '',
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
        sendReplyMail()
    }

    const sendReplyMail = () => { // sending reply mail
        if (!Array.isArray(ZOHOmailMessageAccessToken)) {
            const mailAccessCredencial = async () => {
                const data = {
                    "details": {
                        "fromAddress": `${ZOHOmailAccountDetailResponcePrimaryEmailAddress}`,
                        "toAddress": `${toAddress ? toAddress : mailData.toAddress}`,
                        "ccAddress": `${ccAddress ? ccAddress : mailData.ccAddress}`,
                        "subject": `${mailData.subject !== '' ? (content ? `Fwd : Re: ${mailData.subject}` : `Re: ${mailData.subject}`) : (content ? `Fwd : Re: ${subject}` : `Re: ${subject}`)}`,
                        "content": `${content ? `Fwd : ${content}` : mailData.content}`,
                        "action": `reply`,
                        "askReceipt": `no`
                    }
                }

                // this is params,sending to backend for important extra information like zoho MAIL account ID and MAIL Access Token
                const extras = {
                    "params": {
                        "extras": {
                            "accountId": ZOHOmailAccountdID && JSON.parse(ZOHOmailAccountdID),
                            "messageId": messageID ? messageID : 0,
                            "access_token": `${JSON.parse(ZOHOmailMessageAccessToken)}`,
                        }
                    }
                }

                try {
                    const mailSendResponce = await axios.post(`https://crm-server-opal.vercel.app/api/mailDataIndividualReply`, data, extras)// this line send the request to node (server.js) 
                    if (mailSendResponce.data.status.code == 200) {
                        messageDrop('success', 'Replied sent successfully')
                        setReplySendStatus(false)
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


    return (
        <div>
            <Row>
                <form onSubmit={checkForSubmitting}>
                    <p>
                        <label for="fromAddress"><span style={required}>* &nbsp;</span>From-Address </label>
                        <input type="email" name="fromAddress" id="fromAddress" placeholder={`From Address`} value={ZOHOmailAccountDetailResponcePrimaryEmailAddress} onChange={handleChange} style={greyColor} />
                    </p>

                    <p>
                        <label for="toAddress"> <span style={required}>* &nbsp;</span>To-Address</label>
                        <input type='email' name="toAddress" id="toAddress" placeholder='To Address' value={toAddress ? toAddress : ''} onChange={handleChange} style={greyColor} />
                    </p>

                    <p>
                        <label for="content"> <span style={required}>* &nbsp;</span>Content </label>
                        <textarea name="content" id="content" placeholder='content' value={mailData.content} onChange={handleChange} className={getInputClass('content') ? "inputError" : 'errorClear'}></textarea>
                    </p>

                    <p>
                        <label for="subject"> <span> &nbsp;</span>Subject </label>
                        <input type="text" name="subject" id="subject" placeholder={`subject`} value={mailData.subject} onChange={handleChange} className={getInputClass('subject') ? "inputError" : 'errorClear'} />
                    </p>

                    <p>
                        <label for="statrDate"> <span style={required}> &nbsp;</span>ccAddress</label>
                        <input type="text" name="ccAddress" id="ccAddress" placeholder={`ccAddress`} value={ccAddress ? ccAddress : mailData.ccAddress} onChange={handleChange} />
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

export default ZOHOIndividualReplyMail