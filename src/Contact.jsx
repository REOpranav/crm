import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import { message, Row, Table, Space, Typography, Popconfirm, Button, Col } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import Searching from './Searching'
import moment from 'moment'

// this is for getting the code (query param) from URL
const urlSearch = new URLSearchParams(window.location.search)
const Authcode = urlSearch.get('code')
const baseUrl = new URL(window.location.href)
baseUrl.pathname = ''

const Contact = () => {
  const navigate = useNavigate();
  const { Text } = Typography
  const styles = { fontWeight: 'lighter' }
  const [contactData, setContactData] = useState([]) // store the contact data come from URL 

  // this are for searching components
  const [searching, setSearching] = useState([]) // searching input field value
  const [searchBy, setsearchBy] = useState([]) // total contact data list
  const [selectedOption, setSelectedOption] = useState('firstname') // option fireld
  const [calculateSymbol, setCalculateSymbol] = useState('equal to')
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const filter = Array.isArray(contactData) && contactData?.filter(value => {  // filtering the data (which are the data are same as selectedOption )
    const comparisonFunction = {  // this object for finiding the === object
      'equal to': (a, b) => a == b,
      'greater than': (a, b) => a > b,
      'greater than equal to': (a, b) => a >= b,
      'lesser then equal to': (a, b) => a <= b,
      'lesser than': (a, b) => a < b,
      'not equal to': (a, b) => a !== b,
    }

    const comparisonFn = comparisonFunction[calculateSymbol]
    const finalValues = comparisonFn(value[selectedOption]?.toLowerCase(), searching.toString().toLowerCase())
    return finalValues
  })

  // this functionf fetch the datas from URL/contact 
  const fetching = async () => {
    try {
      const responce = await axios.get(`https://crm-server-opal.vercel.app/mongoDB/contacts`)
      if (responce.status === 200) {
        setContactData(await responce.data);
        setsearchBy(await responce.data)
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

  // this function is totally for store call log
  const makeCall = (number, id) => {
    const data = {
      id: id,
      date: moment().format('MMMM Do YYYY, h:mm:ss a') // used moment.js for time
    }

    if (number) {
      const logPost = async () => {
        try {
          const URL = `https://crm-server-opal.vercel.app/client/calllogs`
          const posting = await axios.post(URL, { callLogData: data })// post the data
          if (posting.status === 200) {
            message.success('Calls are stored in Call log')
          }
          if (posting.status === 201) {
            window.location.href = `tel:${number}` // this is simple call ('this' number)
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

  // this code for storing mail log fron contact page
  const makeMail = (number, id) => {
    const data = {
      id: id,
      date: moment().format('MMMM Do YYYY, h:mm:ss a') // used moment.js for time
    }

    if (number) {
      const logPost = async () => {
        try {
          const URL = `https://crm-server-opal.vercel.app/client/maillogs`
          const posting = await axios.post(URL, { mailLogData: data })
          if (posting.status === 200) {
            message.success('Mail are stored in mail log')
          }
          if (posting.status === 201) {
            window.location.href = `mailto:${number}` // this is simple call ('this' number)
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

  // this is column for tabel (antd)
  const column = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (value, record) => <Link to={`/contactDetail/detail/${record.id}`}> {value} </Link>
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

  // this is for set the fethched data into data array (for showing in table)
  const data = []
  for (const datas of filter?.length !== 0 ? filter : Array.isArray(contactData) ? contactData : []) { // telling if filtered data are available show that only or show all data in webpage
    let changeTOObject = {
      key: datas.id,
      id: datas.id,
      firstName: datas.firstname,
      secondName: datas.lastname,
      emailID: datas.email,
      mobileNumber: datas.mobile,
      companyName: datas.companyName,
      annualRevenue: datas.annualrevenue ? datas.annualrevenue : 0,
      gender: datas.gender
    }
    data.push(changeTOObject)
  }

  // this code is selecting the row for deleting
  const rowSelection = {
    type: 'checkbox',
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // this is for delete the selected data
  const deleteThedata = async () => {
    try {
      let deleting;
      for (const deleteValue of selectedRowKeys) {
        deleting = await axios.post(`https://crm-server-opal.vercel.app/contact/delete`, {
          id: deleteValue
        })
      }
      if (deleting.status == 200) {
        message.success("sucessfully Deleted the data")
      }
      setSelectedRowKeys(0)
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

  // navigating function (react router dom)
  const homeNavigation = () => {
    navigate('/')
  }

  // this is for navigation
  const formNavigate = () => {
    navigate('./formpage')
  }

  // this is initial fetch the data
  useEffect(() => {
    fetching()
  }, [undefined, selectedRowKeys])

  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} style={{ padding: '10px' }} >
        <Space>
          <Text style={{ fontSize: '20px', color: 'red', fontWeight: 'lighter' }}>Contact View</Text>
        </Space>
        <Space>
          {selectedRowKeys.length > 0 && <Popconfirm title="Are you sure to Delete" okText="Yes" cancelText="No" onConfirm={deleteThedata} onCancel={() => message.error('Cancel Delete')}> <Button type='primary'> Delete </Button> </Popconfirm>}
          <Button type='default' onClick={homeNavigation}>Back to Home</Button>
          <Searching setSearchQuery={setSearching} searchQuery={searching} listOfData={searchBy} selectedOption={selectedOption} setSelectedOption={setSelectedOption} calculateSymbol={calculateSymbol} setCalculateSymbol={setCalculateSymbol} />
          <Button type='primary' id='themeColor' onClick={formNavigate}>Create Contact</Button>
        </Space>
      </Row>

      <Row justify={'space-around'}>
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
          <Table rowSelection={rowSelection} columns={column} dataSource={data} pagination={false} scroll={{ y: 400 }} size='small' />
        </Col>

      </Row>
    </div>
  )
}

export default Contact