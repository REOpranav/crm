import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Row,Space,Typography,Popconfirm, message, Table} from 'antd'
import Searching from './Searching'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Deal = () => {
  const navigate = useNavigate();
  const { Text } = Typography

  const [dealData,setDealData] = useState([])
  const [searchBy,setSearchBy] = useState('')
  const [selectedOption, setSelectedOption] = useState('dealowner'); // this id for set selection
  const [searching,setSearching] = useState('') // this searching for lead
  const [calculateSymbol,setCalculateSymbol] = useState("equal to")
  const [selectedRowKeys,setselectedRowKeys] = useState([])
 
  // this code for initial load and when lead added
  const fetching = async()=>{
      try {
          const responce = await axios.get('http://localhost:3000/deals')

            if (responce.status === 200) {
                setDealData(await responce.data);
                setSearchBy(await responce.data);
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
    },[undefined,selectedRowKeys])
    
    // this is for deleting the leads
    const deleteThedata = async()=>{
      try {
        const URL = `http://localhost:3000/deals`
        let deleting ;
        for (const deleteValue of selectedRowKeys) {
          deleting = await axios.delete(`${URL}/${deleteValue}`)        
        }
        if (deleting.status === 200) {
          message.success("sucessfully Deleted the data") 
        }
        setselectedRowKeys(0)
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
    
    // this is for selecting the row key 
    const rowSelection = {
      type: 'checkbox',
      onChange: (key) => {
        setselectedRowKeys(key);  
      },
    }; 
    
    // this refers the column layout for showing data (Antd)
    const column = [
      {
        title: 'Deal Name',
        dataIndex: 'dealName',
        key: 'dealName',        
        render : (value,records) => <Link to={`./detail/${records.id}`}> {records.dealName} </Link>
      },
      {
        title:'Amount',
        dataIndex: 'amount',
        key: 'amount',
      },       
      {
        title:'Closing Date',
        dataIndex: 'closingDate',
        key: 'closingDate',
        render: (text) => {
          const currentDate = new Date();
          const parsedDate = new Date(text);
          return (
            <Text
              style={{
                backgroundColor: parsedDate < currentDate ? 'red' : 'lightGreen',
              }}
            >
              {text}
            </Text>
          );
        }
      },          
      {
        title:'Contact Name',
        dataIndex: 'contactName',
        key: 'contactName',
      },
      {
        title: 'Deal Owner',
        dataIndex: 'dealowner',
        key: 'dealowner',
      },     
    ]   

    const filter = dealData.filter(value => {  // filtering the data (which are the data are same as selectedOption )
      const comparisonFunction  = {  // this object for finiding the === object
        'equal to' : (a,b) => a == b,
        'greater than' : (a,b) => a > b,
        'greater than equal to' : (a,b) => a >= b,
        'lesser then equal to' : (a,b) => a <= b,
        'lesser than' : (a,b) => a < b,
        'not equal to' : (a,b) => a !== b,
      }
      
      const comparisonFn = comparisonFunction[calculateSymbol]
      const finalValues = comparisonFn(value[selectedOption].toLowerCase(),searching.toString().toLowerCase())
      return finalValues
     })
  
     
    let data = [] // this is for handing table (antd) (my method)
    for (const datas of filter.length !== 0 ? filter : dealData) {
        let changeTOObject = {
           key : datas.id,
           id : datas.id,
           dealowner:datas.dealowner,
           dealName:datas.dealName,
           amount:datas.amount,
           closingDate:datas.closingDate,
           contactName:datas.contactName
        }
        data.push(changeTOObject)
    }
      
    const homeNavigation = ()=>{
      navigate('/')
    }
  
  return (
    <div>
      <Dashboard />
      <Row justify={'space-between'} style={{padding:'10px'}}>
              <Space>
                <Text style={{fontSize:'20px',color:'red',fontWeight:'lighter'}}>Deal View</Text>
              </Space>
              <Space>
                  {selectedRowKeys.length > 0 &&  <Popconfirm title="Are you sure to Delete" okText="Yes" cancelText="No" onConfirm={deleteThedata} onCancel={() => message.error('Cancel Delete')}> <Button type='primary'> Delete </Button> </Popconfirm> }
                  <Button type='default' onClick={homeNavigation}>Back to Home</Button>
                  <Popconfirm title="Are you sure to save" okText="Yes" cancelText="No" onConfirm={homeNavigation} onCancel={() => message.error('Cancel Save')}>
                      <Button type='dashed'>Save & Home</Button> 
                  </Popconfirm>
                  <Searching setSearchQuery={setSearching} searchQuery={searching} listOfData={searchBy} selectedOption={selectedOption} setSelectedOption={setSelectedOption} setCalculateSymbol={setCalculateSymbol}/>
              </Space>
        </Row>
        <Table rowSelection={rowSelection} columns={column} dataSource={data} pagination={false} scroll={{y: 400}}/>
    </div>
  )
}

export default Deal