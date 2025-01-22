import React, { useState } from 'react'
import './FastLeadGen.css'
import { GrFormCheckmark } from "react-icons/gr";
import { Tooltip, Alert } from 'antd';
const FastLeadGen = ({ setFastLeadGenData, onFinish }) => {
    const inputValue = document.querySelector('#leadGen')
    const suggestionsBox = document.querySelector('#suggestionsBox')
    const form = document.querySelector('.forming');
    let incomingFormData = {};

    ['input'].forEach(events => { // this is only for showing the dropdown when '@' symbols is appear 
        form?.addEventListener(events, (formElement) => {
            formElement.preventDefault()
            let arrayValue = ['vadivel', 'pranav', 'iangar', 'sri'] // this is dynamic change as per organization
            let findingAmbersandElement = inputValue.value.lastIndexOf('@')

            if (findingAmbersandElement !== -1) {
                let typingValue = inputValue.value.substring(findingAmbersandElement + 1)
                let filtering = arrayValue.filter(items => items.toLowerCase().match(typingValue))

                if (filtering.length > 0) {
                    suggestionsBox.style.display = 'block'
                    suggestionsBox.innerHTML = filtering
                        .map(item => `<div class="suggestion">${item}</div>`).join('')
                } else {
                    suggestionsBox.style.display = 'none';
                }
            } else {
                suggestionsBox.style.display = 'none';
            }

            const suggestion = document.querySelectorAll('.suggestion')

            suggestion.forEach(value => value.addEventListener('click', (e) => {
                e.preventDefault()
                inputValue.value += e.target.textContent + ' '
                suggestionsBox.style.display = 'none';
            }))
        })
    })

    form?.addEventListener('submit', (value) => {
        value.preventDefault()
        incomingFormData = {}
        let match;
        const regex = /@(\w+)|#F\s(\w+)|#L\s(\w+)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi; // regex for seperation each node after the specific symbold
        let inputFinalValue = inputValue.value

        while ((match = regex.exec(inputFinalValue)) !== null) {
            if (match[1]) { incomingFormData.leadowner = match[1] ? match[1] : "vadivel" }
            if (match[2]) { incomingFormData.firstname = match[2] }
            if (match[3]) { incomingFormData.lastname = match[3] }
            if (match[0].includes("@") && !match[1]) { incomingFormData.email = match[0] }
        }
        setFastLeadGenData(incomingFormData)
        inputValue.value = ''
    })


    const submitClick = async() => {
        incomingFormData = {}
        let match;
        const regex = /@(\w+)|#F\s(\w+)|#L\s(\w+)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi; // regex for seperation each node after the specific symbold
        let inputFinalValue = inputValue.value

        while ((match = regex.exec(inputFinalValue)) !== null) {
            if (match[1]) { incomingFormData.leadowner = match[1] ? match[1] : "vadivel" }
            if (match[2]) { incomingFormData.firstname = match[2] }
            if (match[3]) { incomingFormData.lastname = match[3] }
            if (match[0].includes("@") && !match[1]) { incomingFormData.email = match[0] }
        }
        incomingFormData.id =  JSON.stringify(Math.floor(Math.random() * 1000000000))
        
        await setFastLeadGenData(incomingFormData)
        await onFinish()
        inputValue.value = ''
    }

    return (
        <div>
            <form class="forming">
                <div id="suggestionsBox" class="suggestions"></div>
                <Tooltip placement='leftTop' title={
                    <Alert
                        description={<>
                            <div>
                                "@" for Owner.
                            </div >
                            <div>
                                "#f" for First Name.
                            </div>
                            <div>
                                "#l" for Last Name.
                            </div>
                            <div>
                                write email without using "#".
                            </div>
                        </>}
                        type="info"
                    />
                } color='#daf0ff'>
                    <input type="text" name="leadGen" id="leadGen" placeholder='Fast lead Creation using symbols' />
                </Tooltip>
                <div id='parentOfSubmitIcon'>
                    <GrFormCheckmark className='submitIcon' onClick={submitClick} size={20} />
                </div>
            </form>
        </div>
    )
}

export default FastLeadGen
