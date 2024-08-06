import React from 'react'
import {Button , Row ,Col ,message,Table} from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const LeadBoard = () => {
    const [leadData,setLeadData] = useState([])

    // code for navigatingin reactg router dom
    const navigate = useNavigate();
    const formNavigate = ()=>{
        navigate('/formpage')        
    }   

    // this code for initial load and when lead added
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
    },[undefined,leadData])

    // this code for appending field name into antd table
    const data = []
    for (const datas of leadData) {
        let changeTOObject  = {
            id:datas.id,
            firstName : datas.firstname,
            secondName : datas.lastname,
            emailID : datas.email,
            mobileNumber  : datas.mobile,
            companyName:datas.companyName,
            annualRevenue : datas.annualrevenue ?  datas.annualrevenue : 0
        }       
        data.push(changeTOObject)
    }

    // this refers the column layout in Antd
    const column = [
          {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            render : (text) => <a>{text}</a>
          },
          {
            title: 'Second Name',
            dataIndex: 'secondName',
            key: 'secondName',
          },
          {
            title:'Email Id',
            dataIndex: 'emailID',
            key: 'emailID',
          },        
          {
            title:'Mobile Number',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
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
          <Row justify={'end'} style={{padding:'10px'}}>
                <Button type='primary' onClick={formNavigate}>Create Lead</Button>
          </Row>
          
          <Row justify={'center'}>
             <Table columns={column} dataSource={data} style={{width : '80%'}} pagination={false} bordered scroll={{y: 400 }}/>
          </Row>
            

    </div>
  )
}

export default LeadBoard