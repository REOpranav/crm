import React, { useState, useEffect, useDebugValue } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import {message,Row,Table, Space,Typography, Popconfirm, Button, Col} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Searching from './Searching'
import moment from 'moment'

const Contact = () => {
  const navigate = useNavigate();
  const {Text} = Typography
  const [contactData,setContactData] = useState([]) // store the contact data come from URL 

  // this are for searching components
  const [searching,setSearching] = useState('') // searching input field value
  const [searchBy,setsearchBy] = useState('') // total contact data list
  const [selectedOption,setSelectedOption] = useState('firstname') // option fireld
  const [calculateSymbol,setCalculateSymbol] = useState('===')
  
  const filter = contactData.filter(value => {  // filtering the data (which are the data are same as selectedOption )
    const comparisonFunction  = {
      '===' : (a,b) => a === b,
      '==' : (a,b) => a == b,
      '>' : (a,b) => a > b,
      '>=' : (a,b) => a >= b,
      '<=' : (a,b) => a <= b,
      '<' : (a,b) => a < b,
      '!==' : (a,b) => a !== b,  
    }

    const comparisonFn = comparisonFunction[calculateSymbol];    
    const finalValues = comparisonFn(value[selectedOption].toLocaleLowerCase(),searching.toLocaleLowerCase())
    return finalValues
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

    // this function is totally for store call log
    const makeCall = (number,id) => {
      const data = {
          id : id,
          date :moment().format('MMMM Do YYYY, h:mm:ss a') // used moment.js for time
      }
    
      if (number) {
        const logPost = async()=>{
          try {
                const URL = `http://localhost:3000/logs`
                const posting = await axios.post(URL,data) // post the data
                if (posting.status === 201) {
                  message.success('Calls are stored in Call log')
                }
                if (posting.status === 201) {
                   window.location.href = `tel:${number}` // this is simple call ('this' number)
                }
              } catch (err) {
                if (err.response) {
                  message.error('Error: ' + err.response.status+' - '+ ( err.response.data.message || 'Server Error'));
                } else if (err.request) {
                  message.error('Error: No response   from server.');
                } else {
                  message.error('Error: ' + err.message);
                }
              }
            }
          logPost()
      }
    };

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
      render : (text,record) => <Popconfirm title={'Are you sure to call'} okText={'Call'} cancelText={'No'}  onConfirm={() => makeCall(text,record.id)} onCancel={()=>message.error('Canceled call')}> <a> {text} </a> </Popconfirm>  

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
  const styles = { fontWeight:'lighter' }    
  
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
                 <Searching setSearchQuery={setSearching} searchQuery={searching} listOfData={searchBy} selectedOption={selectedOption} setSelectedOption={setSelectedOption} calculateSymbol={calculateSymbol} setCalculateSymbol={setCalculateSymbol}/>
          </Space>
          </Row>

        <Row justify={'space-around'}>
         <Col span={3} style={{backgroundColor:'white',display:'flex',flexDirection:'column',justifyContent:'space-around',borderRadius:'10px',padding:'5px',minHeight:'80vh',maxHeight:'80vh'}}>
              <label style={styles}>
                <input type="checkbox" name="TouchedRecords" />
                  Touched Records
              </label>
              <label style={styles  }>
                <input type="checkbox" name="UntouchedRecords" />
                  Untouched Records
              </label>
              <label style={styles}>
                <input type="checkbox" name="RecordAction" />
                  Record Action
              </label>
              <label style={styles}>
                <input type="checkbox" name="RelatedRecordsAction" />
                 Related Records Action
              </label>
              <label style={styles}>
                <input type="checkbox" name="ScoringRules" />
                  Scoring Rules
              </label>
              <label style={styles}>
                <input type="checkbox" name="Locked" />
                 Locked
              </label>
              <label style={styles}>
                <input type="checkbox" name="EmailSentiment" />
                  Email Sentiment
              </label>
              <label style={styles}>
                <input type="checkbox" name="LatestEmailStatus" />
                 Latest Email Status
              </label>
              <label style={styles}>
                <input type="checkbox" name="Activities" />
                  Activities
              </label>
              <label style={styles}>
                <input type="checkbox" name="Notes" />
                   Notes
              </label>
              <label style={styles}>
                <input type="checkbox" name="Campaigns" />
                 Campaigns
              </label>
              <label style={styles}>
                <input type="checkbox" name="Cadences" />
                Cadences
              </label>
            </Col>
            <Col span={20} offset={1}>
              <Table columns={column} dataSource={data} pagination={false} scroll={{y: 400 }}/>
            </Col>

        </Row>
    </div>
  )
}

export default Contact