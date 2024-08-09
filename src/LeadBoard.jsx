import React from 'react'
import {Button , Row ,Col ,message,notification,Table ,Space, Flex , Typography , Popconfirm} from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';

function id(values) {
  let cal = parseInt(values) + parseInt(1)
  return cal
}
const themeColor = '#65CCB8'

const LeadBoard = () => {
    const [leadData,setLeadData] = useState([])
    const { Text }= Typography
  
    // code for navigatingin reactg router dom
    const navigate = useNavigate();
    const formNavigate = ()=>{
        navigate('/formpage')        
    }

    const homeNavigation = ()=>{
      navigate('/')
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
            render : (value) => <Link to={`./detail/${value}`}> {value} </Link>
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
      <Dashboard />
          <Row justify={'space-between'} style={{padding:'10px'}} >
          <Space>
             <Text style={{fontSize:'16px',color:'grey'}}>Lead View</Text>
             
          </Space>
            <Space >
              {/* <Flex gap={'small'}> */}
                 <Button type='default' onClick={homeNavigation}>Back to Home </Button>
                 <Popconfirm title="Are you sure to save" okText="Yes" cancelText="No" onConfirm={homeNavigation} onCancel={() => message.error('Cancel Save')}>
                    <Button type='dashed'>Save & Home </Button> 
                 </Popconfirm>
                <Button type='primary' onClick={formNavigate}>Create Lead</Button>
              {/* </Flex> */}
          </Space>

          </Row>
          <Row justify={'center'}>
            <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400 }}/>
          </Row>

    </div>
  )
}

export default LeadBoard