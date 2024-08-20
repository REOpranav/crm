import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {message,Row,Table,Typography} from 'antd'
import { Link } from 'react-router-dom'

const InnerDeal = ({id,setSelectedRowKey}) => {  
  
  const [dealData,setDealData] = useState([])
  const {Text} = Typography

  const fetching = async()=>{
    try {
        const responce = await axios.get(`http://localhost:3000/deal`)                         
            if (responce.status === 200) {
              setDealData(await responce.data)
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
    
    const filterParticularDeal = dealData.filter((values)=>{
        if (values.id === id) {
           return values
        }
    })
    
    // this is row selection object for 
    const rowSelection = {
        type: 'checkbox',
        onChange: (rowId) => {
          setSelectedRowKey(rowId);
        },
      };
      
    // this refers the column layout for showing data (Antd)
    const column = [
      {
        title: 'Deal Name',
        dataIndex: 'dealName',
        key: 'dealName',
        render : (value,records) => <Link to={`/deal/detail/${records.id}`}> {value} </Link>
      },
      {
        title: 'Deal Owner',
        dataIndex: 'dealowner',
        key: 'dealowner',
      },
      {
        title:'Amount',
        dataIndex: 'amount',
        key: 'amount',
      },        
      {
        title:'closing Date',
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

    let data = []
    for (const datas of filterParticularDeal) {
        let changeTOObject = {
           key :datas.id,
           id : datas.id,
           dealowner:datas.dealowner,
           dealName:datas.dealName,
           amount:datas.amount,
           closingDate:datas.closingDate
        }
        data.push(changeTOObject)
    }
    
  return (
    <div>
        <Row style={{padding:'10px'}} justify={'start'}>
          <Text style={{color:'grey',fontWeight:'lighter',fontFamily:'monospace'}}> Deal </Text>
        </Row>
       <Table rowSelection={rowSelection} columns={column} dataSource={data} pagination={false} scroll={{y: 400}}/>
    </div>
  )
}

export default InnerDeal