import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import {message,Row,Table, Space,Typography, Popconfirm, Button} from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const Contact = ({searchValue}) => {
  const navigate = useNavigate();
  const {Text} = Typography
  const [contactData,setContactData] = useState([])

  const fetching = async()=>{
    try {
        const responce = await axios.get('http://localhost:3000/contact')
          if (responce.status === 200) {
            setContactData(await responce.data);
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

  const column = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render : (value) => <Link to={`/contactDetail/detail/${value}`}> {value} </Link>
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

  const data = []
  for (const datas of contactData) {
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
  useEffect(()=>{
    fetching()
  },[undefined])

  const homeNavigation = ()=>{
    navigate('/')
  }
  
  
  return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}} >
          <Space>
             <Text style={{fontSize:'20px',color:'red',fontWeight:'lighter'}}>Contact View</Text>
          </Space>
            <Space>
              {/* <Flex gap={'small'}> */}
                 <Button type='default' onClick={homeNavigation}>Back to Home</Button>
                 <Popconfirm title="Are you sure to save" okText="Yes" cancelText="No" onConfirm={homeNavigation} onCancel={() => message.error('Cancel Save')}>
                    <Button type='dashed'>Save & Home</Button> 
                 </Popconfirm>
              {/* </Flex> */}
          </Space>

          </Row>
        <Row justify={'center'}>
            <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400 }}/>
        </Row>
    </div>
  )
}

export default Contact