import { Menu, Row, Typography, Image, Space, Flex, Button, Col, message } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AiFillSetting } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import './Dashboard.css'
import BarChart from './chart/BarChart';
import PieChart from './chart/PieChart';
import LineChart from './chart/LineChart';
import MeetingChart from './chart/MeetingChart';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Dashboard = ({ count }) => {

    const [leadData, setLeadData] = useState([])
    const [contact, setContact] = useState([])
    const [account, setAccount] = useState([])
    const [deal, setDeal] = useState([])

    // this is tawk live chat codes
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/66fe2648256fb1049b1c3e51/1i98cb32a';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    })();

    // this code for initial load and when lead added
    const fetching = async (urls) => {
        try {
            for (const url of urls) {
                const responce = await axios.get(`${url}`)
                if (responce.status === 200) {
                    if (url.includes('/leads')) {
                        setLeadData(await responce.data);
                    } else if (url.includes('/contacts')) {
                        setContact(await responce.data)
                    } else if (url.includes('/accounts')) {
                        setAccount(await responce.data)
                    } else if (url.includes('/deals')) {
                        setDeal(await responce.data)
                    }
                }
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

    let url = [
        'http://localhost:3000/leads',
        'http://localhost:3000/contacts',
        'http://localhost:3000/accounts',
        'http://localhost:3000/deals',
    ]

    useEffect(() => {
        fetching(url)
    }, [undefined])

    const navigate = useNavigate();
    const iconColor = "#fff"

    const home = () => {
        navigate('/')
    }

    const restAPiPage = () => {
        navigate('/restapi')
    }

    return (
        <div className='dashBoardHead'>
            <Row justify={'space-between'} className='headRow'>
                <Menu mode="horizontal" className='manu' theme='light'>
                    {/* <Menu.Item> */}
                    <div class="topHead" onClick={home}>
                        <div class="logohead1">
                            <div class="logoBox1"></div>
                            <div class="logoBox2"></div>
                        </div>
                        <div class="logohead2">
                            <div class="logoBox3"></div>
                            <div class="logoBox4"></div>
                        </div>
                    </div>
                    {/* </Menu.Item> */}

                    <Menu.Item key="leadBoard">
                        <Link to={'/leads'} className='PoppinsFont'>Lead</Link>
                    </Menu.Item>

                    <Menu.Item key="Contact">
                        <Link to={'/contacts'} className='PoppinsFont'> Contact</Link>
                    </Menu.Item>

                    <Menu.Item key="Acount">
                        <Link to={'/accounts'} className='PoppinsFont'>Account</Link>
                    </Menu.Item>

                    <Menu.Item key="deal">
                        <Link to={'/deals'} className='PoppinsFont'>Deal </Link>
                    </Menu.Item>

                    <Menu.Item key="meetingDetail">
                        <Link to={'/meetingDetail'} className='PoppinsFont'>Meeting </Link>
                    </Menu.Item>
                </Menu>

                <Space size={'large'}>
                    {/* <span style={{position:'absolute'}}> <span style={{display:'flex',marginTop:'-10px',color:'white'}}> {counter} </span></span> */}
                    <AiFillSetting color={iconColor} className='PoppinsFont' />
                    <Link to={'/'}>
                        <Flex gap={'small'} align='center' style={{ marginRight: '10px' }}>
                            <Image
                                width={30}
                                src="data:image/jpeg;base64,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"
                                preview={true}
                                style={{ borderRadius: '100px', border: '1px solid white' }}
                            />
                        </Flex>
                    </Link>
                </Space>
            </Row>

            {/* this code are dash baord */}
            {(window.location.href == 'http://localhost:3001/' || window.location.href == 'https://mockcrm.vercel.app/') &&
                <div className='totalDashboard'>
                    <Row justify={'space-between'}>
                        <Col span={24}>
                            <Row id='welcome-row'>
                                <Col id='welcome-message'>Welcome Pranavavadivel S</Col>
                                <Col id='api-navigation-button'><Button onClick={restAPiPage}>Explore Zoho REST APIs</Button></Col>
                            </Row>
                            <Row id='totalViewOfDashboard'>
                                <Col span={4} id='totalCountValues'>
                                    <Row>
                                        <Col id='leadCount'>
                                            <Row id='countHead'>Lead list size</Row>
                                            <Row id='countNumber' onClick={() => navigate('/leads')} justify={'space-between'}>
                                                <Col span={12} id='countValue'>{leadData?.length}</Col>
                                                <Col id='countLogo'><IoIosArrowForward /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col id='contactCount'>
                                            <Row id='countHead'>Contact list size</Row>
                                            <Row id='countNumber' onClick={() => navigate('/contacts')} justify={'space-between'}>
                                                <Col span={12} id='countValue'>{contact?.length}</Col>
                                                <Col id='countLogo'><IoIosArrowForward /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col id='accountCount'>
                                            <Row id='countHead'>No of Account</Row>
                                            <Row id='countNumber' onClick={() => navigate('/accounts')} justify={'space-between'}>
                                                <Col span={12} id='countValue'>{account?.length}</Col>
                                                <Col id='countLogo'><IoIosArrowForward /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col id='dealCount'>
                                            <Row id='countHead'>No of Deal</Row>
                                            <Row id='countNumber' onClick={() => navigate('/deals')} justify={'space-between'}>
                                                <Col span={12} id='countValue'>{deal?.length}</Col>
                                                <Col id='countLogo'><IoIosArrowForward /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={20} offset={0.5}>
                                    <Row id='chart_head'>
                                        <Col id='pie-chart-col'><PieChart lead={leadData?.length} contact={contact?.length} account={account?.length} deal={deal?.length} /></Col>
                                        <Col id='bar-chart-col'><BarChart lead={leadData?.length} contact={contact?.length} account={account?.length} deal={deal?.length} /></Col>
                                        <Col id='line-chart-col'><LineChart lead={leadData?.length} contact={contact?.length} account={account?.length} deal={deal?.length} /></Col>
                                        <Col id='meeting-chart-col'><MeetingChart lead={leadData?.length} contact={contact?.length} account={account?.length} deal={deal?.length} /></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            }

        </div>
    )
}

export default Dashboard