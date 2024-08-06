import React from 'react'
import {Row , Form ,Input,message ,InputNumber ,Button} from 'antd'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FormPage = () => {
    const navigation = useNavigate()
    const [form] = Form.useForm()
    
  function navigate() {
    navigation('/')
  }

  function messageSuccess(){
     message.success('Sucessfully created a Lead')
  }

    const layout = {
        labelCol: {
          span: 9,
        },
        wrapperCol: {
          span: 16,
        },  
      };

  const onFinish = (values)=>{
     axios.post('http://localhost:3000/leads',values)
      .then(res => {
        if (res.status == 201) {
          messageSuccess();
        }
    }).catch(err => {
      if (err.response) {
        message.error('Error: ' + err.response.status+' - '+(err.response.data.message || 'Server Error'));
      } else if (err.request) {
        message.error('Error: No response from server.');
      } else {
        message.error('Error: ' + err.message);
      }
    })

    setTimeout(()=>{
      navigate()
    },1*1000)
    
  }

  return (
    <Row style={{padding:'10px'}}>
        <Form 
         {...layout}
          form={form}
          name="leadForm"
          initialValues={{remember : true}}
          autoComplete="off"
          onFinish={onFinish}
        >
            <Form.Item 
              label="First Name"
               name="firstName"
               rules={[
                {required:true,message:`* Field is Required`},
                {type:'string',message:`First name is only in string !`},
              ]}
            >
                <Input placeholder='First Name'/>
            </Form.Item>

            <Form.Item
              label="Last name" 
               name="secoundName"
               rules={[
                {required:true , message:`* Field is Required`},
                {type:'string',message:`First name is only in string !`}
               ]}
            >
                <Input placeholder='Secound Name' />   
            </Form.Item>

            <Form.Item 
                label="Company"
               name="company"
               rules={[
                {required:true , message:`* Field is Required`},
                {type:'string',message:`First name is only in string !`}
               ]}
            >
                <Input placeholder='company Name' />   
            </Form.Item>
            
            <Form.Item 
               label="Annual Revenue"
               name="annual revenue"
               rules={[
                {type : 'number',message:'Should be in number'}
               ]}
               initialValue={0}
            >
                <InputNumber placeholder='Annual Revenue' style={{width:'100%'}}/>   
            </Form.Item>
            
            <Form.Item >
                <Button type="primary" htmlType="submit">
                     Submit
                </Button>
            </Form.Item>
        </Form>
    </Row>
  )
}
export default FormPage