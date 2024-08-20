import React, { useEffect, useState } from 'react'
import {Button, Col, message,Typography, Row,Space} from 'antd'
import axios from 'axios'
import Dashboard from './Dashboard'
import { useNavigate } from 'react-router-dom'

const styles = { fontWeight:'lighter'}

// this all css only for row number 157
 const style = {
    color:'grey'
 }
 
 const stagestyle = {
    border:'1px solid black',
    padding:'10px',
 }

 const dealDetailCss ={ 
    display:'flex',
    justifyContent:'start',
 }

 const paddingStyle = { 
    padding:'10px'
 }

const DealDetail = () => {
    const navigate = useNavigate();
    const {Text} = Typography
    const [dealDeatail,setDealDetail] = useState([])
   
    const URL = window.location.pathname
    const endpoint = URL.split('/').pop()
    
    // this code for initial load and when lead added
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/deal/${endpoint}`)            
            if (responce.status === 200) {
                setDealDetail(await responce.data);
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

    // navigating function (react router dom)
    const homeNavigation = ()=>{
        navigate('/')
    }

    const currentDate = new Date();
    const parsedDate = new Date(dealDeatail.closingDate);
    
return (
    <div>
    <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}} >
          <Space>
             <Text style={{fontSize:'20px',color:'red',fontWeight:'lighter'}}>Contact View</Text>
          </Space>
          <Space>
              <Button type='default' onClick={homeNavigation}>Back to Home</Button> 
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
            
            <Col span={20} offset={1} >
                <Row style={{backgroundColor:'white',padding:'10px',marginBottom:'15px'}}>  
                    <Row justify={'space-between'} style={{width:'100%'}}>
                        <Col> <Text style={style} className='PoppinsFont'> {dealDeatail ? `${dealDeatail.dealName} - Deals`: 'no data found'} </Text> </Col>
                        <Col> 
                            <Row style={style} className='PoppinsFont' justify={'center'}>{dealDeatail  ? `${`Closing Date`}` : ''} </Row>
                            <Row style={{backgroundColor: parsedDate < currentDate ? 'red' : 'lightGreen',}} className='PoppinsFont' justify={'center'}>{dealDeatail  ? dealDeatail.closingDate : ''} </Row>
                        </Col>
                    </Row>

                    <Row style={{width:"100%",marginTop:'10px'}}>
                        <Col span={4} style={stagestyle}></Col>
                        <Col span={4} style={stagestyle}></Col>
                        <Col span={4} style={stagestyle}></Col>
                        <Col span={4} style={stagestyle}></Col>
                        <Col span={4} style={stagestyle}></Col>
                        <Col span={4} style={stagestyle}></Col>
                    </Row>
                </Row>

                <Row style={{backgroundColor:'white',padding:'10px',marginBottom:'10px'}}>
                    <Col span={24}>
                        <Row style={paddingStyle}>
                             <Col span={3} style={dealDetailCss} > <Text style={style} className='PoppinsFont'> Deal Owner </Text> </Col>
                             <Col> <Text className='PoppinsFont'>: {dealDeatail.dealowner} </Text></Col> 
                        </Row>
                        
                        <Row style={paddingStyle}>
                            <Col span={3} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> closing Date </Text> </Col>
                            <Col> <Text className='PoppinsFont'> : {dealDeatail.closingDate} </Text> </Col> 
                        </Row>

                        <Row style={paddingStyle}>
                            <Col span={3} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> Stage </Text> </Col>
                            <Col> <Text className='PoppinsFont'>: {dealDeatail.Stage} </Text> </Col> 
                        </Row>
                        
                        <Row style={paddingStyle}>
                            <Col span={3} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> Territory </Text> </Col>
                            <Col> <Text className='PoppinsFont'>: {dealDeatail.area} </Text> </Col> 
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
  )
}

export default DealDetail