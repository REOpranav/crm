import React, { useEffect } from 'react'
import { json, Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import { Row, Button, Typography, Col, Flex, message } from 'antd'
import { useState } from 'react'
import './FormLayout.css';
import axios from 'axios'
import './LeadEditForm.css'

// this is message ele from antd
function messageSuccess() {
    message.success('Sucessfully created a Layout')
}

const FormLayout = () => {
    const navigation = useNavigate() //this is for navigation   
    const { Text } = Typography
    const [layoutName, setlayoutName] = useState("")
    const [formData, setFormData] = useState([])
    const [finalFormData, setFinalFormData] = useState({
        id: layoutName,
        inputs: []
    })

    const URL = window.location.pathname
    const splittingURL = URL.split('/')
    const moduleName = splittingURL.filter(e => e).shift()


    // this is drag and drop codes
    useEffect(() => {
        const formID = document.getElementById('pasteForm')
        const form = document.getElementById('form')

        const pTag = document.querySelectorAll('p')
        let targetValue = ''
        pTag.forEach(e => {
            e.addEventListener('drag', (e) => {
                e.preventDefault()
                targetValue = e.target
            })
        })
        formID.addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        formID.addEventListener('drop', (e) => {
            e.preventDefault()
            formID.appendChild(targetValue)
            setFormData(formID.children) // inside the custome form
        })

        form.addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        form.addEventListener('drop', (e) => {
            e.preventDefault()
            form.appendChild(targetValue)
        })
    }, [undefined])

    useEffect(() => {
        let totalInputs = []
        for (const a of formData) {
            totalInputs.push(a.outerHTML)
        }
        setFinalFormData({ id: layoutName, inputs: totalInputs })
    }, undefined)

    const onFinish = (e) => {
        e.preventDefault()
        formHandle() // this is form handling and posting the data
    }

    const formHandle = () => {
        const layoutLable = document.querySelector('#layoutName')
        if (layoutLable.value == '') {
            setError(layoutLable)
        } else {
            setSuccess(layoutLable)
        }
    }

    function setError(element) {
        let parentAccess = element.parentElement
        parentAccess.firstElementChild.className = 'inputError'
    }

    function setSuccess(element) {
        let parentAccess = element.parentElement
        parentAccess.firstElementChild.className = ''

        axios.post('http://localhost:3000/formLayout', finalFormData)
            .then(res => {
                if (res.status == 201) {
                    messageSuccess();
                }

            }).catch(err => {
                if (err.response) {
                    message.error('Error: ' + err.response.status + ' - ' + (err.response.data.message || 'Server Error'));
                } else if (err.request) {
                    message.error('Error: No response   from server.');
                } else {
                    message.error('Error: ' + err.message);
                }
            })

        setTimeout(() => {
            navigate()
        }, 1 * 100)
    }

    // this for navigation
    function navigate() {
        if (moduleName == 'leads') {
            navigation(`/leads/formpage`)
        } else if (moduleName == "contacts") {
            navigation(`/contacts/formpage`)
        }
    }

    return (
        <div >
            <Dashboard />
            <Row justify={'space-between'} style={{ padding: '10px' }}>
                <div id='layoutNameSubmit'>
                    <input type="text" id='layoutName' placeholder='Layout Name' value={layoutName} onChange={(e) => setlayoutName(e.target.value)} /> <br />
                    <span></span>
                </div>
                <Flex gap={'small'}>
                    <Link to={`/${moduleName}/formpage`}><Button type='default'>Back one step</Button></Link>
                    <Button type='primary' onClick={onFinish}>Save My Form</Button>
                </Flex>
            </Row>

            <Row justify={'center'}>
                <Col span={5}>
                    <form id='form' style={{ width: '90%', minHeight: '80vh', maxHeight: '80vh', overflow: 'scroll' }} >
                        <p draggable>
                            <label for="leadowner">Lead Owner : </label>
                            <input type="text" name="leadowner" id="leadowner" placeholder="Lead Owner *" />
                        </p>
                        <p draggable>
                            <label for="firstname">First Name : </label>
                            <input type="text" name="firstname" id="firstname" placeholder="First Name *" />
                        </p>

                        <p draggable>
                            <label for="lastname">Last Name : </label>
                            <input type="text" name="lastname" id="lastname" placeholder="Last Name *" />
                        </p>

                        <p draggable>
                            <label for="email">Email : </label>
                            <input type="email" name="email" id="email" placeholder="Email *" />
                        </p>

                        <p draggable>
                            <label for="mobile">Mobile Number : </label>
                            <input type="tel" name="mobile" id="mobile" placeholder="Mobile Number *" minLength={10} maxLength={10} />
                        </p>
                        <p draggable>
                            <label for="date">closing Date : </label>
                            <input type="date" name="date" id="date" placeholder="closing Date *" />
                        </p>

                        <p draggable>
                            <label for="companyName">company Name : </label>
                            <input type="text" name="companyName" id="companyName" placeholder="company Name" />
                        </p>
                        <p draggable>
                            <label for="gender">Gender : </label>
                            <input type="text" name="gender" id="gender" placeholder="Gender" />
                        </p>
                        <p draggable>
                            <label for="area">Area : </label>
                            <input type="text" name="area" id="area" placeholder="Area" />
                        </p>
                        <p draggable>
                            <label for="pincode">Pincode : </label>
                            <input type="number" name="pincode" id="pincode" placeholder="Pincode" />
                        </p>
                        <p draggable>
                            <label for="state">State : </label>
                            <input type="text" name="state" id="state" placeholder="State" />
                        </p>
                        <p draggable>
                            <label for="country">Country : </label>
                            <input type="text" name="country" id="country" placeholder="Country" />
                        </p>
                        <p draggable>
                            <label for="expectedAmount">Expected Amount : </label>
                            <input type="text" name="expectedAmount" id="expectedAmount" placeholder="Expected Amount" />
                        </p>
                        <p draggable>
                            <label for="website">Website : </label>
                            <input type="url" name="website" id="website" placeholder="Website" />
                        </p>

                        <p draggable>
                            <label for="annualrevenue">Annual Revenue : </label>
                            <input type="number" name="annualrevenue" id="annualrevenue" placeholder="Annual Revenue" />
                        </p>
                        <p draggable>
                            <label for="description">Description : </label>
                            <textarea name="description" id="description" placeholder='Description' />
                        </p>

                    </form>
                </Col>

                <Col span={19}>
                    <form style={{ width: '90%', minHeight: '80vh', maxHeight: '80vh', overflow: 'scroll' }} id='pasteForm'> </form>
                </Col>
            </Row>


        </div>
    )
}

export default FormLayout