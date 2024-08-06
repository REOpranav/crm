import React from 'react'
import {Button , Row} from 'antd'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    const formNavigate = ()=>{
        navigate('/formpage')        
    }   
  return (
    <div>
        <Row justify={'space-around'}> 
            <Button type='primary' onClick={formNavigate}>
                Create Lead
            </Button>
        </Row>
    </div>
  )
}

export default Dashboard