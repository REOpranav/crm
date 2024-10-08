import React, { useEffect, useState } from 'react'
import { Button, Col, message, Typography, Row, Space, Tooltip } from 'antd'
import axios from 'axios'
import Dashboard from './Dashboard'
import { useNavigate, Link } from 'react-router-dom'
import './DealDetail.css'

const styles = { fontWeight: 'lighter' }

// this all css only for row number 157
const style = {
    color: 'grey'
}


const dealDetailCss = {
    display: 'flex',
    justifyContent: 'start',
}

const paddingStyle = {
    padding: '10px'
}

const overviewStyle = {
    backgroundColor: 'white',
    padding: '10px',
    marginBottom: '10px',
}

const overviewHeading = {
    backgroundColor: '#5a3bb6',
    padding: '5px',
    color: 'white',
    borderRadius: '5px'
}

const DealDetail = () => {
    const navigate = useNavigate();
    const { Text } = Typography
    const [dealDeatail, setDealDetail] = useState([])
    const [DealInformationFromContact, setDealInformationFromContact] = useState([])
    const [DealInformationFromAccount, setDealInformationFromAccount] = useState([])
    const [stageValue, setStageValue] = useState('')
    const [notes, setNotes] = useState([])

    // get the URL
    const URL = window.location.pathname
    const endpoint = URL.split('/').pop()

    // this code for showing the fetching
    const fetching = async () => {
        try {
            const responce = await axios.get(`http://localhost:3000/deals/${endpoint}`)
            if (responce.status === 200) {
                setDealDetail(await responce.data)
            }
            try {
                const contactResponse = await axios.get(`http://localhost:3000/contacts/${endpoint}`)
                if (contactResponse.status === 200) {
                    setDealInformationFromContact(contactResponse.data)
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    try {
                        const accountResponse = await axios.get(`http://localhost:3000/accounts/${endpoint}`)
                        if (accountResponse.status === 200) {
                            setDealInformationFromAccount(accountResponse.data);
                        }
                    } catch (accountError) {
                        console.error("Error fetching account data:", accountError)
                    }
                } else {
                    console.error("Error fetching contact data:", error)
                }
            }
        } catch (err) {
            if (err.response) {
                message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
            } else if (err.request) {
                message.error('Error: No response from server.')
            } else {
                message.error('Error: ' + err.message);
            }
        }
    }

    useEffect(() => {
        fetching()
    }, [undefined])

    // navigating function (react router dom)
    const homeNavigation = () => {
        navigate('/')
    }

    // this is date
    const currentDate = new Date();
    const parsedDate = new Date(dealDeatail.closingDate)

    const stage = (stage) => {
        setStageValue(stage)
    }

    // finding the current stage ti set the background color
    const CurrentStages = document.querySelectorAll('.stages')

    return (
        <div>
            <Dashboard />
            <Row justify={'space-between'} style={{ padding: '10px' }} >
                <Space>
                    <Text style={{ fontSize: '20px', color: 'red', fontWeight: 'lighter' }}> Contact View </Text>
                </Space>
                <Space>
                    {/* <Link to={`/deal/editDeal/${endpoint}`}> <Button type='default'> Edit Deal </Button> </Link> */}
                    <Button type='default' onClick={homeNavigation}>Back to Home</Button>
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
                    <Row style={overviewStyle}>
                        <Row justify={'space-between'} style={{ width: '100%' }}>
                            <Col>
                                <Text style={overviewHeading} className='PoppinsFont'> {dealDeatail ? `${dealDeatail.dealName} - Deals` : 'no data found'} </Text>
                            </Col>
                            <Col>
                                <Row style={style} className='PoppinsFont' justify={'center'}>{dealDeatail ? `${`Closing Date`}` : ''} </Row>
                                <Row style={{ backgroundColor: parsedDate < currentDate ? 'red' : 'lightGreen', }} className='PoppinsFont' justify={'center'}>{dealDeatail ? dealDeatail.closingDate : ''} </Row>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%", marginTop: '10px' }} justify={'space-between'}>
                            <span className='stages' onClick={() => stage('stage 1')} style={stageValue === 'stage 1' ? { backgroundColor: 'lightblue' } : { backgroundColor: 'transparent' }}>stage 1</span>
                            <span className='stages' onClick={() => stage('stage 2')} style={stageValue === 'stage 2' ? { backgroundColor: 'violet' } : { backgroundColor: 'transparent' }}>stage 2</span>
                            <span className='stages' onClick={() => stage('stage 3')} style={stageValue === 'stage 3' ? { backgroundColor: 'gold' } : { backgroundColor: 'transparent' }}>stage 3</span>
                            <span className='stages' onClick={() => stage('stage 4')} style={stageValue === 'stage 4' ? { backgroundColor: 'pink' } : { backgroundColor: 'transparent' }}>stage 4</span>
                            <span className='stages' onClick={() => stage('win')} style={stageValue === 'win' ? { backgroundColor: 'greenyellow' } : { backgroundColor: 'transparent' }}>win</span>
                            <span className='stages' onClick={() => stage('Closed')} style={stageValue === 'Closed' ? { backgroundColor: 'orangered' } : { backgroundColor: 'transparent' }}>Closed</span>
                        </Row>
                    </Row>

                    <Row style={overviewStyle}>
                        <Col span={24}>
                            <Row style={paddingStyle}>
                                <Col span={3} style={dealDetailCss} > <Text style={style} className='PoppinsFont'> Deal Owner </Text> </Col>
                                <Col> <Text className='PoppinsFont'>: {dealDeatail.dealowner} </Text></Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={3} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> closing Date </Text> </Col>
                                <Col>   <Text className='PoppinsFont'> : {dealDeatail.closingDate} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={3} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> Stage </Text> </Col>
                                <Col> <Text className='PoppinsFont'>: {stageValue ? stageValue : dealDeatail.stage} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={3} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> Territory </Text> </Col>
                                <Col> <Text className='PoppinsFont'>: {dealDeatail.area} </Text> </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* this code is deal informatio */}
                    <Row style={overviewStyle}>
                        <Col span={24}>
                            <Row style={{ color: 'black', marginBottom: '10px' }} > <Text style={overviewHeading} className='PoppinsFont'> Deal Information </Text> </Row>
                        </Col>

                        <Col span={12}>
                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> Deal Owner </Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.dealowner ? dealDeatail.dealowner : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'> Deal Name </Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.dealName ? dealDeatail.dealName : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Contact Name </Text> </Col>
                                <Col> <Tooltip title="click to view this origin" color='green' placement='right'><Text className='PoppinsFont'><Link to={`/contactDetail/detail/${DealInformationFromContact.id}`}> : {DealInformationFromContact.firstname ? DealInformationFromContact.firstname : '-'} </Link> </Text> </Tooltip> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Account Name </Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {DealInformationFromAccount.firstname ? DealInformationFromAccount.firstname : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Amount</Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.amount ? dealDeatail.amount : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Closing Date </Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.closingDate ? dealDeatail.closingDate : '-'} </Text> </Col>
                            </Row>
                        </Col>

                        <Col span={12}>
                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Company Name </Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.companyName ? dealDeatail.companyName : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Expected Amount </Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.expectedAmount ? dealDeatail.expectedAmount : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>State</Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.state ? dealDeatail.state : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Pincode</Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.pincode ? dealDeatail.pincode : '-'} </Text> </Col>
                            </Row>

                            <Row style={paddingStyle}>
                                <Col span={6} style={dealDetailCss}> <Text style={style} className='PoppinsFont'>Website</Text> </Col>
                                <Col> <Text className='PoppinsFont'> : {dealDeatail.website ? dealDeatail.website : '-'} </Text> </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* this is for notes */}
                    <Row style={overviewStyle}>
                        <Col span={24}>
                            <Row style={{ marginBottom: '10px' }} > <Text style={overviewHeading} className='PoppinsFont'> Notes </Text> </Row>
                            <Row justify={'end'}>
                                <Col span={24} > <textarea name="notes" id="notes" style={{ width: '100%' }} value={notes} onChange={(e) => setNotes(e.target.value)}></textarea> </Col>
                                <Col style={paddingStyle}>
                                    <Space>
                                        <Button type='primary' onClick={() => message.success('Notes Added')}>Add notes</Button>
                                        <Button type='default' onClick={() => message.error('Notes Cancelled')} >Cancel</Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default DealDetail