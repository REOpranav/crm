import { message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'

const Calllogs = () => {
    const [logData,setLogData] = useState('')
    const url = window.location.href
    const endpoint = url.split('/').pop()

    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/logs/${endpoint}`)
              if (responce.status === 200) {
                setLogData(await responce.data);  
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
      }, [endpoint]); 
    
      useEffect(() => {
        if (logData) {
          console.log(logData);
        }
      }, [logData]);  

  return (
    <div>Calllogs</div>
  )
}

export default Calllogs