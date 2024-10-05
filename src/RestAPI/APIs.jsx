import { Button, Col, Row, Tooltip } from 'antd'
import React, { useState } from 'react'
import Dashboard from '../Dashboard'
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';

const APIs = () => {

    const navigate = useNavigate();
    const [suitName, setSuitName] = useState("Email & Collaboration")
    const [sales, setSales] = useState(false)
    const [customerService, setCustomerService] = useState(false)
    const [finance, setFinance] = useState(false)
    const [humanResources, setHumanResources] = useState(false)
    const [email_Collaboration, setEmail_Collaboration] = useState(true)
    const [businessIntelligence, setBusinessIntelligence] = useState(false)
    const [customSolutions, setCustomSolutions] = useState(false)

    // this is for dynamic heading 
    const suit_Name = (name) => {
        setSuitName(name)
    }

    const sales_Market = () => {
        setCustomerService(false)
        setEmail_Collaboration(false)
        setFinance(false)
        setHumanResources(false)
        setBusinessIntelligence(false)
        setCustomSolutions(false)
        setSales(true)
    }

    const customer_Service = () => {
        setFinance(false)
        setHumanResources(false)
        setEmail_Collaboration(false)
        setBusinessIntelligence(false)
        setSales(false)
        setCustomSolutions(false)
        setCustomerService(true)
    }

    const finance_suit = () => {
        setHumanResources(false)
        setBusinessIntelligence(false)
        setEmail_Collaboration(false)
        setSales(false)
        setCustomerService(false)
        setCustomSolutions(false)
        setFinance(true)
    }

    const human_resource = () => {
        setSales(false)
        setBusinessIntelligence(false)
        setEmail_Collaboration(false)
        setCustomerService(false)
        setFinance(false)
        setCustomSolutions(false)
        setHumanResources(true)
    }

    const EmailCollaboration = () => {
        setSales(false)
        setCustomerService(false)
        setFinance(false)
        setHumanResources(false)
        setCustomSolutions(false)
        setBusinessIntelligence(false)
        setEmail_Collaboration(true)
    }

    const business_Intelligence = () => {
        setSales(false)
        setCustomerService(false)
        setFinance(false)
        setHumanResources(false)
        setEmail_Collaboration(false)
        setCustomSolutions(false)
        setBusinessIntelligence(true)
    }

    const custom_Solutions = () => {
        setSales(false)
        setCustomerService(false)
        setFinance(false)
        setHumanResources(false)
        setEmail_Collaboration(false)
        setBusinessIntelligence(false)
        setCustomSolutions(true)
    }

    const home = () => {
        return navigate('/')
    }

    return (
        <div>
            <Dashboard />
            {/* this code are landing page */}
            <Row>
                <Col span={24}>
                    <Tooltip title="Back" placement='right' color='black'><Row justify={'start'} id='backAPIHeading' onClick={home}><IoIosArrowBack /></Row></Tooltip>
                    <Row justify={'space-around'} className='PoppinsFont' id='APIheading'><span>Explore the robust array of REST APIs tailored for each Zoho product.</span> </Row>
                    <Row className='suitOfApplicationView'>
                        <aside>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Sales & Marketing' ? '#fdf4ef' : 'transparent', color: suitName == 'Sales & Marketing' ? '#FD9257' : 'black' }} onClick={sales_Market} className='PoppinsFont'><span onClick={() => suit_Name('Sales & Marketing')}>Sales & Marketing</span></Button></div>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Customer Service' ? '#fdf4ef' : 'transparent', color: suitName == 'Customer Service' ? '#FD9257' : 'black' }} onClick={customer_Service} className='PoppinsFont'><span onClick={() => suit_Name('Customer Service')}>Customer Service</span></Button></div>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Finance' ? '#fdf4ef' : 'transparent', color: suitName == 'Finance' ? '#FD9257' : 'black' }} onClick={finance_suit} className='PoppinsFont'><span onClick={() => suit_Name('Finance')}>Finance</span></Button></div>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Human Resources' ? '#fdf4ef' : 'transparent', color: suitName == 'Human Resources' ? '#FD9257' : 'black' }} onClick={human_resource} className='PoppinsFont'><span onClick={() => suit_Name('Human Resources')}>Human Resources</span></Button></div>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Email & Collaboration' ? '#fdf4ef' : 'transparent', color: suitName == 'Email & Collaboration' ? '#FD9257' : 'black' }} onClick={EmailCollaboration} className='PoppinsFont'><span onClick={() => suit_Name('Email & Collaboration')}>Email & Collaboration</span></Button></div>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Business Intelligence' ? '#fdf4ef' : 'transparent', color: suitName == 'Business Intelligence' ? '#FD9257' : 'black' }} onClick={business_Intelligence} className='PoppinsFont'><span onClick={() => suit_Name('Business Intelligence')}>Business Intelligence</span></Button></div>
                            <div><Button type='text' style={{ backgroundColor: suitName == 'Custom Solutions' ? '#fdf4ef' : 'transparent', color: suitName == 'Custom Solutions' ? '#FD9257' : 'black' }} onClick={custom_Solutions} className='PoppinsFont'><span onClick={() => suit_Name('Custom Solutions')}>Custom Solutions</span></Button></div>
                        </aside>

                        <main>
                            <section>
                                {sales &&
                                    <div class="imagesRow1">
                                        <div class="images1">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/crm.svg" onClick={() => window.open('https://www.zoho.com/crm/developer/docs/api/v3/', '_blank')} />
                                        </div>
                                        <div class="images2">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/bookings.svg" onClick={() => window.open('https://www.zoho.com/bookings/help/api/v1/generate-accesstoken.html', '_blank')} />
                                        </div>

                                        <div class="images3">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/commerce.svg" onClick={() => window.open('https://www.zoho.com/commerce/api/introduction.html', '_blank')} />
                                        </div>
                                        <div class="images4">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/salesiq.svg" onClick={() => window.open('https://www.zoho.com/salesiq/help/developer-section/rest-api-portal-list.html', '_blank')} />
                                        </div>
                                        <div class="images5">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/sign.svg" onClick={() => window.open('https://www.zoho.com/sign/api/', '_blank')} />
                                        </div>
                                        <div class="images6">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/zohobigin.svg" onClick={() => window.open(' https://www.bigin.com/developer/docs/apis/?source=developer', '_blank')} />
                                        </div>
                                    </div>
                                }

                                {customerService &&
                                    <div class="imagesRow2">
                                        <div class="images7">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/assist.svg" onClick={() => window.open('https://www.zoho.com/assist/api/introduction.html', '_blank')} />
                                        </div>
                                        <div class="images8">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/desk.svg" onClick={() => window.open('https://desk.zoho.com/DeskAPIDocument#Introduction', '_blank')} />
                                        </div>
                                    </div>
                                }

                                {finance == true &&
                                    <div class="imagesRow3">
                                        <div class="images3">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/books.svg" onClick={() => window.open('https://www.zoho.com/books/api/v3/introduction/#organization-id', '_blank')} />
                                        </div>
                                        <div class="images4">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/expense.svg" onClick={() => window.open('https://www.zoho.com/expense/api/v1/introduction/#overview', '_blank')} />
                                        </div>
                                        <div class="images5">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/inventory.svg" onClick={() => window.open('https://www.zoho.com/inventory/api/v1/introduction/#overview', '_blank')} />
                                        </div>
                                        <div class="images6">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/invoice.svg" onClick={() => window.open('https://www.zoho.com/invoice/api/v3/introduction/#overview', '_blank')} />
                                        </div>
                                        <div class="images7">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/billing.svg" onClick={() => window.open('https://www.zoho.com/billing/api/v1/introduction/#overview', '_blank')} />
                                        </div>
                                    </div>
                                }

                                {humanResources &&
                                    <div class="imagesRow2">
                                        <div class="images7">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/people.svg" onClick={() => window.open('https://www.zoho.com/people/api/overview.html', '_blank')} />
                                        </div>
                                        <div class="images8">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/recruit.svg" onClick={() => window.open('https://help.zoho.com/portal/en/kb/recruit/developer-guide', '_blank')} />
                                        </div>
                                    </div>
                                }

                                {email_Collaboration &&
                                    <div class="imagesRow1">
                                        <div class="images1">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/cliq.svg" onClick={() => window.open('https://www.zoho.com/cliq/help/restapi/v2/', '_blank')} />
                                        </div>
                                        <div class="images2">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/bugtracker.svg" onClick={() => window.open('https://www.zoho.com/projects/help/rest-api/bugtracker-portal-api.html', '_blank')} />
                                        </div>
                                        <div class="images3">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/connect.svg" onClick={() => window.open('https://www.zoho.com/connect/api/authentication.html', '_blank')} />
                                        </div>
                                        <div class="images4">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/mail.svg" onClick={() => window.open('https://www.zoho.com/mail/help/api/overview.html', '_blank')} />
                                        </div>
                                        <div class="images5">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/meeting.svg" onClick={() => window.open('https://www.zoho.com/meeting/api-integration.html', '_blank')} />
                                        </div>
                                        <div class="images6">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/projects.svg" onClick={() => window.open('https://www.zoho.com/projects/help/rest-api/zohoprojectsapi.html', '_blank')} />
                                        </div>
                                        <div class="images7">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/sprints.svg" onClick={() => window.open('https://sprints.zoho.com/apidoc.html#Overview', '_blank')} />
                                        </div>
                                        <div class="images8">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/workdrive.svg" onClick={() => window.open('https://workdrive.zoho.com/apidocs/v1/overview', '_blank')} />
                                        </div>
                                        <div class="images9">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/sheet.svg" onClick={() => window.open('https://sheet.zoho.com/help/api/v2/', '_blank')} />
                                        </div>
                                    </div>
                                }

                                {businessIntelligence &&
                                    <div class="imagesRow2">
                                        <div class="images7">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/analytics.svg" onClick={() => window.open('https://www.zoho.com/analytics/api/v2/introduction.html', '_blank')} />
                                        </div>
                                    </div>
                                }

                                {customSolutions &&
                                    <div class="imagesRow2">
                                        <div class="images7">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/creator.svg" onClick={() => window.open('https://www.zoho.com/creator/help/api/v2/', '_blank')} />
                                        </div>
                                        <div class="images8">
                                            <img src="https://www.zohowebstatic.com/sites/zweb/images/productlogos/catalyst.svg" onClick={() => window.open('https://docs.catalyst.zoho.com/en/api/introduction/overview-and-prerequisites/#OverviewandPrerequisites', '_blank')} />
                                        </div>
                                    </div>
                                }
                            </section>
                        </main>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default APIs