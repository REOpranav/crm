import React, { useState ,useEffect} from 'react'
import {Button, message,notification, Row, Title, Typography, Menu, Flex,Space,Layout,Col,Dropdown} from  'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Detail.css'
import Dashboard from './Dashboard'
import { useNavigate } from 'react-router-dom'

const backGroundColor = '#313949'

// this is message ele from antd
function messageSuccess(){
    message.success('Sucessfully Transfer to Contact')
}

const Detail = () => {
    const [leadData,setLeadData] = useState([])
    const {Title ,Text} = Typography // antd
    const [formData,setFormData] = useState()
    const navigation = useNavigate() //this is for navigation

    const URL = window.location.href
    const id = URL.split('/').pop()

        // this code for initial load and when lead added
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/leads/${id}`)         
                if (responce.status === 200) {
                    setLeadData(await responce.data)
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
      
      const converToContact = async()=>{ 
            let dataFromLead = await axios.get(`http://localhost:3000/leads/${id}`) // first getting the particular id
            await axios.post('http://localhost:3000/contact',dataFromLead.data) // secound post that contact form
              .then(res => {
                if (res.status == 201) {
                  messageSuccess();
                }
                axios.delete(`http://localhost:3000/leads/${id}`) // third code for deleting data in lead

                setTimeout(()=>{
                    navigate()
                },1 * 100) 

            }).catch(err => {
              if (err.response) {
                message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
              } else if (err.request) {
                message.error('Error: No response   from server.');
              } else {
                message.error('Error: ' + err.message);
              }
          }) 
      }

    // this for navigation
    function navigate() {
        navigation('/contact')
    }

    const items = [
        {
          key: '1',
          label: (<Link onClick={converToContact}> Convert to Contact </Link> ),
        },
        {
            key: '2',
            label: (<Link to={'/account'}> Convert to Account </Link> ),
        },
        {
            key: '3',
            label: ( <Link to={'/deal'}> Convert to Deal </Link>),
        }
    ]

    return (
    <div>
        <Dashboard />
        <Row justify={'space-between'} style={{padding:'10px'}}> 
                <Flex gap={'small'}>
                    <Text style={{fontSize:'20px',textTransform:'capitalize',color:'grey',fontWeight:'lighter'}}>{leadData.firstname ?leadData.firstname : 'Profile Name'} - lead</Text>
                </Flex>

                <Flex gap={'small'}>
                    <Button type='primary'>
                        <a href={`mailto:${leadData.email}`}>Send Email</a>
                    </Button>

                    <Dropdown menu={{items}} placement='bottomCenter'>
                        <Button type='primary'> Convert </Button>
                    </Dropdown>
           
                    <Button type='default'>
                        <Link to={`/leadboard/detail/leadeditform/${id}`}>Edit Lead</Link> 
                    </Button>      
                    
                    <Button type='default'>
                        <Link to={'/leadboard'}>Back to Lead Board</Link> 
                    </Button>
                </Flex>
        </Row>
      
        <Row justify={'space-around'}>
            <Col span={3} style={{backgroundColor: 'white',borderRadius:'10px'}} >
             
            </Col>

            <Col span={20} style={{backgroundColor:'white',borderRadius:'10px'}}>
                {Object.entries(leadData).map(([key, value])=>(
                    <Row style={{padding:'10px'}} className='leadDetail' >
                        <Col span={3} style={{textAlign:'end',textTransform:'capitalize',mcolor:'darkblue'}}> {key} : </Col>
                        <Col span={20} style={{textAlign:'start',color:'grey',padding:'3px',overflow:'auto'}} offset={1}> {key.toLocaleLowerCase() == 'email' ? <a href={`mailto:${value}`}> {value} </a> : key.toLocaleLowerCase() == 'website' ? <a href={`${value}`} target='_blank' >{value}</a> : value}</Col> 
                    </Row>
                ))}
            </Col>
        </Row>
    </div>
  )
}

export default Detail