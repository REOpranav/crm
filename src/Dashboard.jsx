import React from 'react'
import {Button , Row ,Col ,message,Table} from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const Dashboard = () => {
    const [leadData,setLeadData] = useState([])
    const navigate = useNavigate();
    const formNavigate = ()=>{
        navigate('/formpage')        
    }   

    useEffect(()=>{
        const fetching = async()=>{
            try {
                const responce = await axios.get('http://localhost:3000/leads')
                if (responce.status === 200) {
                    setLeadData( await responce.data);
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
        fetching()
    },[null])
    
    for (const data of leadData) {

    }

    const column = [
         {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
          },
          {
            title: 'Second Name',
            dataIndex: 'secondName',
            key: 'secondName',
          },         
          {
            title:'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
          },          
          {
            title: 'Annual Revenue',
            dataIndex: 'annualRevenue',
            key: 'annualRevenue',
          },
        ]
        
  return (
    <div>     
          <Row justify={'end'}>
                <Button type='primary' onClick={formNavigate}>
                        Create Lead
                </Button>
          </Row>
          <Row>
             <Table columns={column}/>
          </Row>
            

    </div>
  )
}

export default Dashboard