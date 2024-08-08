import { Menu, Row ,Typography} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
const { SubMenu } = Menu;
const {Text ,Title} = Typography

  return (
    <div>
      <Row justify={'space-between'}>
        <Menu mode="horizontal">
        </Menu>

        <Menu mode="horizontal">  
          <Link to={'./leadBoard'}>
            <Menu.Item key="leadBoard">
                Lead
            </Menu.Item>
          </Link>
          
          {/* <Link to={'./contact'} > */}
            <Menu.Item key="Contact" disabled>
                Contact
            </Menu.Item>
          {/* </Link> */}
          
          {/* <Link to={'./account'}> */}
            <Menu.Item key="Acount" disabled>
                Account
            </Menu.Item>
          {/* </Link>        */}
         
          {/* <Link to={'./deal'}> */}
            <Menu.Item key="deal" disabled>
                Deal 
            </Menu.Item>
          {/* </Link> */}
        </Menu>
    </Row>
    </div>
  )
}

export default Dashboard