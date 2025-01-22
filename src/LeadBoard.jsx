import React from 'react'
import { Button, Row, message, Table, Space, Typography, Popconfirm, Col, Dropdown, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Searching from './Searching';
import moment from 'moment';
import FastLeadGen from './FastLeadGen';
import { HiOutlineInformationCircle } from "react-icons/hi2";

// this is message ele from antd
function messageSuccess() {
  message.success('Sucessfully created')
}

const LeadBoard = () => {
  const [leadData, setLeadData] = useState([])
  const [fastLeadGenData, setFastLeadGenData] = useState([]) // this is the data for fast lead generation 
  const { Text } = Typography

  // searching function
  const [searchBy, setSearchBy] = useState('')
  const [selectedOption, setSelectedOption] = useState('firstname'); // this id for set selection
  const [searching, setSearching] = useState('') // this searching for lead
  const [calculateSymbol, setCalculateSymbol] = useState('equal to')
  const [selectedRowKeys, setselectedRowKeys] = useState([])

  const filter = leadData.filter(value => {  // filtering the data (which are the data are same as selectedOption )
    const comparisonFunction = {  // this object for finiding the === object
      'equal to': (a, b) => a == b,
      'greater than': (a, b) => a > b,
      'greater than equal to': (a, b) => a >= b,
      'lesser then equal to': (a, b) => a <= b,
      'lesser than': (a, b) => a < b,
      'not equal to': (a, b) => a !== b,
    }

    const comparisonFn = comparisonFunction[calculateSymbol];
    const finalValues = comparisonFn(value[selectedOption]?.toLowerCase(), searching.toString().toLowerCase())
    return finalValues
  })
  // code for navigatingin (react router dom)
  const navigate = useNavigate();

  const homeNavigation = () => {
    navigate('/')
  }

  // this code for initial load and when lead added
  const fetching = async () => {
    try {
      const responce = await axios.get('https://crm-server-opal.vercel.app/mongoDB/leads')
      if (responce.status === 200) {
        setLeadData(responce.data);
        setSearchBy(responce.data);
      }
    } catch (err) {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  }

  // this is for deleting the leads
  const deleteThedata = async () => {
    try {
      let deleting;
      for (const deleteValue of selectedRowKeys) {
        deleting = await axios.post(`https://crm-server-opal.vercel.app/leads/delete`, {
          id: deleteValue
        })
      }
      if (deleting.status == 200) {
        message.success("sucessfully Deleted the data")
      }
      setselectedRowKeys(0)
    } catch (err) {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response   from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    }
  }

  // this is row selection object for 
  const rowSelection = {
    type: 'checkbox',
    onChange: (newSelectedRowKeys) => {
      setselectedRowKeys(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    fetching()
  }, [undefined, selectedRowKeys])

  useEffect(() => {
    fetching()
  }, [])

  // this code for appending field name into antd table  
  const data = []
  for (const datas of filter.length !== 0 ? filter : leadData) { // telling if filtered data are available show that only or show all data in webpage
    let changeTOObject = {
      key: datas.id,
      id: datas.id,
      firstName: datas.firstname,
      secondName: datas.lastname,
      emailID: datas.email,
      mobileNumber: datas.mobile,
      companyName: datas.companyName,
      annualRevenue: datas.annualrevenue ? datas.annualrevenue : 0
    }
    data.push(changeTOObject)
  }

  // this function for call log 
  const makeCall = (number, id) => {
    const data = {
      id: id,
      date: moment().format('MMMM Do YYYY, h:mm:ss a') // used moment.js for time
    }

    if (number) {
      const logPost = async () => {
        try {
          const URL = `https://crm-server-opal.vercel.app/client/calllogs` // post the data
          const posting = await axios.post(URL, {
            callLogData: data
          })
          if (posting.status === 200) {
            message.success('Calls are stored in Call log')
          }
          if (posting.status === 200) {
            window.location.href = `tel:${number}` // this is simple call ('this' number)
          }
        } catch (err) {
          if (err.response) {
            message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
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

  // this code for storing mail log from lead page
  const makeMail = (number, id) => {
    const data = {
      id: id,
      date: moment().format('MMMM Do YYYY, h:mm:ss a') // used moment.js for time
    }

    if (number) {
      const logPost = async () => {
        try {
          const URL = `https://crm-server-opal.vercel.app/client/maillogs` // posting Call Log Data
          const posting = await axios.post(URL, {
            mailLogData: data
          })
          if (posting.status === 200) {
            message.success('Mail are stored in mail log')
          }
          if (posting.status === 200) {
            window.location.href = `mailto:${number}` // this is simple call ('this' number)
          }
        } catch (err) {
          if (err.response) {
            message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
          } else if (err.request) {
            message.error('Error: No response from server.');
          } else {
            message.error('Error: ' + err.message);
          }
        }
      }
      logPost()
    }
  };

  // this refers the column layout for showing data (Antd)
  const column = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (value, record) => <Link to={`./detail/${record.id}`}> {value} </Link>
    },
    {
      title: 'Second Name',
      dataIndex: 'secondName',
      key: 'secondName',
    },
    {
      title: 'Email Id',
      dataIndex: 'emailID',
      key: 'emailID',
      render: (text, record) => <Popconfirm title={'Are you sure to Mail'} okText={'Mail'} cancelText={'No'} onConfirm={() => makeMail(text, record.id)} onCancel={() => message.error('mail canceled')}> <a> {text} </a> </Popconfirm>
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      render: (text, record) => <Popconfirm title={'Are you sure to call'} okText={'Call'} cancelText={'No'} onConfirm={() => makeCall(text, record.id)} onCancel={() => message.error('Canceled call')}> <a> {text} </a> </Popconfirm>
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Annual Revenue',
      dataIndex: 'annualRevenue',
      key: 'annualRevenue',
    },
  ]
  const styles = { fontWeight: 'lighter' }

  // this is for drop down (ANTd)
  const items = [
    {
      key: '1',
      label: (<Link to={`https://zcform.in/RflkR`}>For Zoho CRM</Link>),
    },
    {
      key: '2',
      label: (<Link to={`./formpage`}>For This CRM</Link>),
    },
  ]

  // this is for finding the name fron pathname to send  post request in that URL
  const URL = window.location.pathname
  const moduleName = URL.split('/').filter(e => e).shift()

  //this function for get data from form and make post request
  const onFinish = async () => {
    let actualModuleName;
    if (moduleName == 'leads') {
      actualModuleName = 'insertLead'
    } else if (moduleName == 'contacts') {
      actualModuleName = 'insertContact'
    }

    axios.post(`https://crm-server-opal.vercel.app/mongoDB/${actualModuleName}`, {
      indertingData: fastLeadGenData
    }).then(res => {
      if (res.status == 200) {
        messageSuccess();
      }
    }).catch(err => {
      if (err.response) {
        message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response   from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    })
  }

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} style={{ padding: '10px' }}>
        <Space>
          <Text style={{ fontSize: '20px', color: 'red', fontWeight: 'lighter' }}>Lead View</Text>
        </Space>
        <Space>
          <FastLeadGen setFastLeadGenData={setFastLeadGenData} onFinish={onFinish} />
          {selectedRowKeys.length > 0 && <Popconfirm title="Are you sure to Delete" okText="Yes" cancelText="No" onConfirm={deleteThedata} onCancel={() => message.error('Cancel Delete')}> <Button type='primary'> Delete </Button> </Popconfirm>}
          <Searching setSearchQuery={setSearching} searchQuery={searching} listOfData={searchBy} selectedOption={selectedOption} setSelectedOption={setSelectedOption} setCalculateSymbol={setCalculateSymbol} />
          <Dropdown menu={{ items }} placement='bottomCenter'>
            <Button type='default'>Create Lead</Button>
          </Dropdown>
          {/* <Button type='primary'  onClick={formNavigate}></Button> */}
          <Button type='primary' onClick={homeNavigation}>Back to Home</Button>
        </Space>
      </Row>

      <Row justify={'space-between'} id='leadSider'>
        <Col span={3} style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', borderRadius: '10px', padding: '5px', minHeight: '80vh', maxHeight: '80vh' }}>
          <label style={styles}>
            <input type="checkbox" name="TouchedRecords" />
            Touched Records
          </label>
          <label style={styles}>
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
          <Table rowSelection={rowSelection} columns={column} dataSource={data} pagination={false} scroll={{ y: 400 }} />
        </Col>
      </Row>
    </div>
  )
}

export default LeadBoard