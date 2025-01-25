import { message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Row, Typography, Col } from 'antd'
import './Calllog.css'
import { FiPhoneCall } from "react-icons/fi";
import { LuMailCheck } from "react-icons/lu";

const Calllogs = ({ callLogs, emailLog }) => {
  const [logData, setLogData] = useState('')
  const [mailLog, setMailLog] = useState('')
  const [seperateCallLogs, setSeperateCallLogs] = useState([])
  const [seperateMailLogs, setSeperateMailLogs] = useState([])

  //initailly fecthing data using window URL
  const url = window.location.href
  const endpointID = url.split('/').pop()
  const { Text } = Typography

  const fetching = async () => {
    try {
      let Client_ID = { client_id: endpointID }
      const responceForCallLog = await axios.get(`https://crm-server-opal.vercel.app/calllogs/find`, { // this get method for call log 
        params: Client_ID
      })

      const responceForEmailLog = await axios.get(`https://crm-server-opal.vercel.app/emailLogs/find`, { // this get method for mail log
        params: Client_ID
      })
      if (responceForCallLog.status === 200) { // this mail for adding mail log
        setLogData( await responceForCallLog.data)
        if (responceForEmailLog.status === 200) { // this mail for adding mail log
          setMailLog(await responceForEmailLog.data)
        }
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
    fetching();
  }, [undefined, endpointID]);

  useEffect(() => {
    if (logData || callLogs) {
      setSeperateCallLogs(logData)
    }

    if (mailLog || emailLog) {
      setSeperateMailLogs(mailLog)
    }
  }, [callLogs, logData, emailLog, mailLog])

  return (
    <div>
      <Row style={{ padding: '10px' }} justify={'start'}>
        <Text style={{ color: 'grey', fontWeight: 'lighter', fontFamily: 'monospace' }}> Open Activities </Text>
      </Row>

      <Row>
        <Col>
          <Row style={{ padding: '10px', backgroundColor: '#efe8ff', borderRadius: '5px' }} justify={'space-between'}>
            <Text style={{ color: 'black', fontWeight: 'lighter' }}>Call log </Text> <Text><FiPhoneCall color='#8550ff' /></Text>
          </Row>

          <Row>
            <Col style={{ minHeight: '100px', maxHeight: '300px', minWidth: '300px', minWidth: '300px', overflow: 'auto' }}>
              {logData && seperateCallLogs.map(e => {
                return <Row justify={'start'} align={'middle'} className='calllog'> <Text key={e.id} style={{ fontWeight: 'lighter', letterSpacing: '1px' }}>{e.date}</Text> </Row>
              })}
              {seperateCallLogs.length === 0 && <Row justify={'center'} align={'middle'} style={{ padding: '10px' }}> <Text style={{ fontWeight: 'lighter', letterSpacing: '1px' }}>No calls till now</Text> </Row>}
            </Col>
          </Row>
        </Col>

        <Col style={{ marginLeft: '2%' }}>
          <Row style={{ padding: '10px', backgroundColor: '#fef1e1', borderRadius: '5px' }} justify={'space-between'}>
            <Text style={{ color: 'black', fontWeight: 'lighter' }}>Email log</Text>
            <Text><LuMailCheck color='#faab4d' /></Text>
          </Row>

          <Row>
            <Col style={{ minHeight: '100px', maxHeight: '300px', minWidth: '300px', minWidth: '300px', overflow: 'auto' }}>
              {mailLog && seperateMailLogs.map(e => {
                return <Row justify={'start'} align={'middle'} className='calllog'> <Text key={e.id} style={{ fontWeight: 'lighter', letterSpacing: '1px' }}>{e.date}</Text> </Row>
              })}
              {seperateMailLogs.length === 0 && <Row justify={'center'} align={'middle'} style={{ padding: '10px' }}> <Text style={{ fontWeight: 'lighter', letterSpacing: '1px' }}>No mail till now</Text> </Row>}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Calllogs