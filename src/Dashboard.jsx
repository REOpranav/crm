import { Menu, Row ,Typography, Image } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
const { SubMenu } = Menu;
const {Text ,Title} = Typography
const backGroundColor = '#313949'

  return (
    <div> 
      <Row justify={'space-between'} style={{backgroundColor:backGroundColor}}>
        
        <Menu mode="horizontal" style={{backgroundColor:backGroundColor , width:'50%'}} theme='dark' >
          <Menu.Item>
            <Link to={'/'}>
              <Image 
                  width={20}
                  src="https://static.zohocdn.com/crm/images/crm_logo_white_c518bb417c29e9e235a64ca56ff943ec_.svg"
                  preview={false}                
              />
            </Link>
            <Text style={{marginLeft:'10px',color:'white',fontWeight:'bold'}}>Zappy CRM</Text>
          </Menu.Item>
        </Menu>

        <Menu mode="horizontal" style={{backgroundColor:backGroundColor}} theme='dark'>
            <Menu.Item key="leadBoard">
                <Link to={'./leadBoard'}>
                    Lead
                </Link>
            </Menu.Item>
          
          <Link to={'./contact'} >
            <Menu.Item key="Contact">
                Contact
            </Menu.Item>
          </Link>
          
          <Link to={'./account'}>
            <Menu.Item key="Acount">
                Account
            </Menu.Item>
          </Link>       
         
          <Link to={'./deal'}>
            <Menu.Item key="deal">
                Deal 
            </Menu.Item>
          </Link>
        </Menu>
    </Row>
    </div>
  )
}

export default Dashboard