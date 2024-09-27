import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import { Button, Row,Space,Typography,Popconfirm, message, Table, Col, Tooltip} from 'antd'
import Searching from './Searching'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Deal.css'
import { BsKanban } from "react-icons/bs";
import { CiBoxList } from "react-icons/ci";

const Deal = () => {
  const navigate = useNavigate();
  const { Text } = Typography

  let deal_data = document.querySelectorAll('#deal_data')
  let deal_data_head1 = document.querySelector('#deal_data_head1')
  let deal_data_head2 = document.querySelector('#deal_data_head2')
  let deal_data_head3 = document.querySelector('#deal_data_head3')
  let deal_data_head4 = document.querySelector('#deal_data_head4')
  let deal_data_head5 = document.querySelector('#deal_data_head5')
 
  const [dealData,setDealData] = useState([])
  const [searchBy,setSearchBy] = useState('')
  const [selectedOption, setSelectedOption] = useState('dealowner'); // this id for set selection
  const [searching,setSearching] = useState('') // this searching for lead
  const [calculateSymbol,setCalculateSymbol] = useState("equal to")
  const [selectedRowKeys,setselectedRowKeys] = useState([])
  const [kambanView,setkambanView] = useState(false)
  const [listView,setListView] = useState(true)

  function makeListViewTrue() {
      setkambanView(false);
      setListView(true);
  } 

  function makeKambanViewTrue() {
    setListView(false);
    setkambanView(true);
  }

  // this code for getting data from deal 
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

    // this is for deleting the deal in deal module
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
    
    // this is for selecting the row key for deletion
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
      // {
      //   title:'Contact Name',
      //   dataIndex: 'contactName',
      //   key: 'contactName',
      // },
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
    // this is for navigation
    const homeNavigation = ()=>{
      navigate('/')
    }

    useEffect(()=>{
      fetching()
    },[undefined,selectedRowKeys])
    
    console.log(deal_data);

    let targetedValue =''
    deal_data?.forEach(e => {
      e.addEventListener('drag',(e)=>{ 
        e.preventDefault()
          targetedValue = e.target
        }) 
    })


    const addDropListeners = (head)=>{
      head?.addEventListener('dragover',(e)=>{
        e.preventDefault() 
      })   

      head?.addEventListener('drop',(e)=>{
        e.preventDefault()
        if (targetedValue) {
          head?.appendChild(targetedValue)
          targetedValue?.classList?.remove('successDeal')
          targetedValue?.classList?.remove('closinDeal')  
        }
      })
    }

    addDropListeners(deal_data_head1)
    addDropListeners(deal_data_head2)
    addDropListeners(deal_data_head3)

  
  // win and closed
    deal_data_head4?.addEventListener('dragover',(e)=>{
      e.preventDefault()
    })

    deal_data_head4?.addEventListener('drop',(e)=>{
      e.preventDefault()
      deal_data_head4.appendChild(targetedValue)
      targetedValue?.classList?.remove('closinDeal')
      targetedValue?.classList?.add('successDeal')
    })

    deal_data_head5?.addEventListener('dragover',(e)=>{ 
      e.preventDefault()
    })

    deal_data_head5?.addEventListener('drop',(e)=>{
      e.preventDefault()
      deal_data_head5.appendChild(targetedValue)
      targetedValue?.classList?.remove('successDeal')
      targetedValue?.classList?.add('closinDeal')
    })
    
  return ( 
    <div>
      <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}>
              <Space>
                <Text style={{fontSize:'20px',color:'red',fontWeight:'lighter'}}>Deal View</Text>
              </Space> 
              <Space>
                 <div style={{border:'1px solid black',borderRadius:'10px'}}>
                    <Tooltip title="List View"  color={listView ? '#5495ff' : '#5a3bb6'}><Button onClick={makeListViewTrue} type={listView ? 'primary' : 'text'}><CiBoxList /></Button></Tooltip>
                    <Tooltip title="Kanban View" color={kambanView ? '#5495ff' : '#5a3bb6'}> <Button onClick={makeKambanViewTrue} type={kambanView ? 'primary' : 'text'}><BsKanban /></Button></Tooltip>
                  </div> 
                  {selectedRowKeys.length > 0 &&  <Popconfirm title="Are you sure to Delete" okText="Yes" cancelText="No" onConfirm={deleteThedata} onCancel={() => message.error('Cancel Delete')}> <Button type='primary'> Delete </Button> </Popconfirm> }
                  <Searching setSearchQuery={setSearching} searchQuery={searching} listOfData={searchBy} selectedOption={selectedOption} setSelectedOption={setSelectedOption} setCalculateSymbol={setCalculateSymbol}/>
                  <Button type='default' onClick={homeNavigation}>Back to Home</Button>
              </Space> 
        </Row>
    <Row>
      <Col span={24}>
      {listView && 
        <Table rowSelection={rowSelection} columns={column} dataSource={data} pagination={false} scroll={{y: 400}}/> }
       
       {kambanView &&  
         <Row style={{height:'80vh'}}>
            <Col span={5} className="stagesColumn">
              <Row className='Stageheading'><Col span={24}>Stage 1</Col></Row>
              <Row className='stage_content_head_row'>
                <Col span={24}>
                    <div className='deal_data_head' id='deal_data_head1'>
                     {data.map((value)=>{
                        return  <div id='deal_data' draggable key={10}>
                                  <div className='row PoppinsFont'><span className='rowData_key'>Deal Name : </span> {value.dealName}</div>
                                  <div className='row PoppinsFont'><span className='rowData_key'>Amount : </span> {value.amount}</div>
                                  <div className='row PoppinsFont'><span className='rowData_key'>Closing Date : </span> {value.closingDate}</div>
                                  <div className='row PoppinsFont'><span className='rowData_key'>Deal Owner : </span> {value.dealowner}</div>
                                </div>
                      })}
                    </div> 
                </Col> 
              </Row>
            </Col> 

            <Col span={4} className="stagesColumn">
              <Row justify={'center'} className='Stageheading'>Stage 2</Row>
              <Row className='stage_content_head_row'>
                <Col span={24}>
                  <div className='deal_data_head' id='deal_data_head2'> </div>
                </Col>
              </Row>
            </Col>

            <Col span={5} className="stagesColumn">
             <Row justify={'center'} className='Stageheading'>Stage 3</Row>
             <Row className='stage_content_head_row'>
                <Col span={24}>
                  <div className='deal_data_head' id='deal_data_head3'> </div>
                </Col>
             </Row>
            </Col>

            <Col span={5} className="stagesColumn">
              <Row justify={'center'} className='Stageheading' style={{borderTop:'3px solid green',backgroundColor:'#dff7e4'}}>closed Won</Row>
              <Row className='stage_content_head_row'>
                <Col span={24}>
                  <div className='deal_data_head' id='deal_data_head4'> </div>
                </Col>
              </Row>
            </Col> 

            <Col span={5} className="stagesColumn">
              <Row justify={'center'} className='Stageheading' style={{borderTop:'3px solid red',backgroundColor:'#fcdfdf'}}>closed Loss</Row>
              <Row className='stage_content_head_row'>
                <Col span={24}>
                  <div className='deal_data_head' id='deal_data_head5'> </div> 
                </Col>
              </Row>
            </Col>
         </Row>   
       }
       </Col>
    </Row>
    </div>
  )
}

export default Deal