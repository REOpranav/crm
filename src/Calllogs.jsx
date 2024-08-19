import { message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Row,Typography,Col} from 'antd'
import './Calllog.css'

const Calllogs = ({callLogs,emailLog}) => {
    const [logData,setLogData] = useState('')
    const [mailLog,setMailLog] = useState('')
    const [seperateCallLogs,setSeperateCallLogs] = useState([])
    const [seperateMailLogs,setSeperateMailLogs] = useState([])

    //initailly fecthing data using window URL
    const url = window.location.href
    const endpoint = url.split('/').pop()
    const {Text} = Typography

    const fetching = async()=>{
        try {
            const responceForCallLog = await axios.get(`http://localhost:3000/callLogs`) // this get method for call log 
            const responceForEmailLog = await axios.get(`http://localhost:3000/emailLogs`) // this get method for mail log
              if (responceForCallLog.status === 200) { // this mail for adding mail log
                setLogData(await responceForCallLog.data);                
              }
              if (responceForEmailLog.status === 200) { // this mail for adding mail log
                setMailLog(await responceForEmailLog.data)
              }
            } catch (err) {
                if (err.response) {
                    message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
                } else if (err.request) {
                    message.error('Error: No response from server.');
                } else {
                    message.error('Error: ' + err.message);
                }
            }
      }

      useEffect(() => {
        fetching();
      }, [undefined,endpoint]); 
          
      useEffect(()=>{
         if (logData || callLogs) {
            let filteringKey = callLogs ? callLogs : logData
            let ans = filteringKey.filter(e => e.id === endpoint)
            setSeperateCallLogs(ans)
         }

         if (mailLog || emailLog) {
            let filteringKey = emailLog ? emailLog : mailLog
            let ans = filteringKey.filter(e => e.id === endpoint)
            setSeperateMailLogs(ans)
         }
      },[undefined,callLogs,logData,emailLog])

  return (
    <div>
       <Row style={{padding:'10px'}} justify={'start'}>
            <Text style={{color:'grey',fontWeight:'lighter',fontFamily:'monospace'}}> Open Activities </Text>
        </Row>
      
        <Row>
          <Col>
              <Row style={{padding:'10px',backgroundColor:'#C0C0C0',borderRadius:'5px'}} justify={'start'}> 
                <Text style={{color:'black',fontWeight:'lighter'}}>Call log</Text>
              </Row>
            
              <Row>
                  <Col style={{minHeight:'100px',maxHeight:'300px',minWidth:'300px',minWidth:'300px',overflow:'auto'}}>
                    {logData && seperateCallLogs.map(e => {
                      return  <Row  justify={'start'} align={'middle'}  className='calllog'> <Text key={e.id} style={{fontWeight:'lighter',letterSpacing:'1px'}}>{e.date}</Text> </Row>
                    })}
                    {seperateCallLogs.length === 0 && <Row  justify={'center'} align={'middle'} style={{padding:'10px'}}> <Text style={{fontWeight:'lighter',letterSpacing:'1px'}}>No calls till now</Text> </Row>} 
                  </Col>
              </Row>
           </Col>

          <Col style={{marginLeft:'2%'}}>
              <Row style={{padding:'10px',backgroundColor:'#C0C0C0',borderRadius:'5px'}} justify={'start'}> 
                <Text style={{color:'black',fontWeight:'lighter'}}>Email log</Text>
              </Row>
              
              <Row>
                  <Col style={{minHeight:'100px',maxHeight:'300px',minWidth:'300px',minWidth:'300px',overflow:'auto'}}>
                    {mailLog && seperateMailLogs.map(e => {
                      return  <Row  justify={'start'} align={'middle'}  className='calllog'> <Text key={e.id} style={{fontWeight:'lighter',letterSpacing:'1px'}}>{e.date}</Text> </Row>
                    })}
                    {seperateMailLogs.length === 0 && <Row  justify={'center'} align={'middle'} style={{padding:'10px'}}> <Text style={{fontWeight:'lighter',letterSpacing:'1px'}}>No mail till now</Text> </Row>} 
                  </Col>
              </Row>
          </Col>
       </Row>
    </div>
  )
}

export default Calllogs