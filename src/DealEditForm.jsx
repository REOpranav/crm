import { message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const pathname = window.location.pathname 
const endpoint  = pathname.split('/').pop()

const DealEditForm = () => {

    const [dealDetail,setDealDetail] = useState([])
    const fetching = async()=>{
        try {
            const responce = await axios.get(`http://localhost:3000/deals/${endpoint}`)
            if (responce.status === 200) {
                setDealDetail(await responce.data)
            }
        } catch (err) {
            if (err.response) {
                message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
            } else if (err.request) {
                message.error('Error: No response from server.')
            } else {
                message.error('Error: ' + err.message);
            }
        }
    }

    useEffect(()=>{
        fetching()
    },[undefined])

    console.log(dealDetail);

  return (
    <div className='yes'>
        <div className='dealEditForm'>
            DealEditForm
        </div>
    </div>

  )
}

export default DealEditForm