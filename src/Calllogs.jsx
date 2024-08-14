import { message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Row,Typography,Col,Space} from 'antd'
import './Calllog.css'

const Calllogs = ({callLogs}) => {  
    const [logData,setLogData] = useState('')
    const [seperateCallLogs,setSeperateCallLogs] = useState([])

    //initailly fecthing data using window URL
    const url = window.location.href
    const endpoint = url.split('/').pop()
    const {Text} = Typography

    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/logs`)
              if (responce.status === 200) {
                setLogData(await responce.data);
                console.log('called func');
                
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
      },[undefined,callLogs,logData])

  return (
    <div >
      <Row style={{padding:'10px'}} justify={'start'}>
         <Text style={{color:'grey',fontWeight:'lighter',fontFamily:'monospace'}}> Open Activities </Text>
      </Row>
      
      <Row style={{padding:'10px',backgroundColor:'#C0C0C0'}} justify={'start'}> 
        <Text style={{color:'black',fontWeight:'lighter'}}>Call log</Text>
      </Row>
       
      <Row>
          <Col style={{minHeight:'300px',maxHeight:'300px',minWidth:'300px',minWidth:'300px',overflow:'auto'}}>
            {logData && seperateCallLogs.map(e => {
              return  <Row  justify={'start'} align={'middle'}  className='calllog'> <Text key={e.id} style={{fontWeight:'lighter',letterSpacing:'1px'}}>{e.date}</Text> </Row>
            })} 
          </Col>
       </Row>


    </div>
  )
}

export default Calllogs