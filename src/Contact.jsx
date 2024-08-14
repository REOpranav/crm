import React, { useState, useEffect, useDebugValue } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import {message,Row,Table, Space,Typography, Popconfirm, Button} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Searching from './Searching'

const Contact = () => {
  const navigate = useNavigate();
  const {Text} = Typography
  const [contactData,setContactData] = useState([]) // store the contact data come from URL 
  
  // this are for searching components
  const [searching,setSearching] = useState('') // searching input field value
  const [searchBy,setsearchBy] = useState('') // total contact data list
  const [selectedOption,setSelectedOption] = useState('firstname') // option fireld
  const filter = contactData.filter(value => {   // filtering the data (which are the data are same as selectedOption )
    if (value[selectedOption].toLocaleLowerCase() === searching.toLocaleLowerCase()) { return value }
   })

  // this functionf fetch the datas from URL/contact 
  const fetching = async()=>{
    try {
        const responce = await axios.get('http://localhost:3000/contact')
          if (responce.status === 200) {
            setContactData(await responce.data);
            setsearchBy(await responce.data)
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

  // this is column for tabel (antd)
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

  // this is for set the fethched data into data array (for showing in table)
  const data = []
  for (const datas of filter.length !== 0 ? filter :contactData) { // telling if filtered data are available show that only or show all data in webpage
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

  // navigating function (react router dom)
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
                 <Button type='default' onClick={homeNavigation}>Back to Home</Button>
                 <Popconfirm title="Are you sure to save" okText="Yes" cancelText="No" onConfirm={homeNavigation} onCancel={() => message.error('Cancel Save')}>
                    <Button type='dashed'>Save & Home</Button> 
                 </Popconfirm>
                 <Searching setSearchQuery={setSearching} searchQuery={searching} listOfData={searchBy} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
          </Space>

          </Row>
        <Row justify={'center'}>
            <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400 }}/>
        </Row>
    </div>
  )
}

export default Contact