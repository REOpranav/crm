import React from 'react'
import {Button , Row ,Col ,message,Table ,Space, Flex , Typography} from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Leadinfo from './Leadinfo';

function id(values) {
  let cal = parseInt(values) + parseInt(1)
  return cal
}

const LeadBoard = () => {
    const [leadData,setLeadData] = useState([])
    const { Text }= Typography
  
    // code for navigatingin reactg router dom
    const navigate = useNavigate();
    const formNavigate = ()=>{
        navigate('/formpage')        
    }

    // this code for initial load and when lead added
    const fetching = async()=>{
          try {
              const responce = await axios.get('http://localhost:3000/leads')
                if (responce.status === 200) {
                    setLeadData(await responce.data);
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

    useEffect(()=>{
      fetching()
    },[undefined])

    // this code for appending field name into antd table
    const data = []
    for (const datas of leadData) {
        let changeTOObject = {
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render : (value) => <Link to={`./leadinfo/${value}`}> {value} </Link>
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
            title:'Email Id',
            dataIndex: 'emailID',
            key: 'emailID',
            render: (text) => <a href={`mailto:${encodeURIComponent(text)}`}>{text}</a>
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
              <Flex gap={'small'}>
                <Link to={'/'}> <Button type='primary'>  Dashboard  </Button> </Link>  
                <Button type='primary' onClick={formNavigate}>Create Lead</Button>
              </Flex>
          </Row>
          
          <Row justify={'center'}>
            <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400 }}/>
          </Row>

    </div>
  )
}

export default LeadBoard