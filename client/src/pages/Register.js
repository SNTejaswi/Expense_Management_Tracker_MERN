import React ,{useEffect, useState}from 'react';
import { Form, Input,message } from 'antd';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
const Register = () => {
  const navigate = useNavigate()
  const[loading,setLoading]=useState(false)
  const SubmitHandler=async(values)=>{
    try{
      setLoading(true)
      await axios.post('http://localhost:8080/api/v1/users/register', values);
      message.success('Registeration Successful');
      setLoading(false)
      navigate('/login')
    }catch(error){
      setLoading(false)
      message.error('Something Went Wrong');

    }
}
useEffect(()=>{
  if(localStorage.getItem('user')){
    navigate('/')
  }
},[navigate]
);
  return (
    <div className='register-page'>
      {loading && <Spinner/>}
      <Form layout="vertical" onFinish={SubmitHandler}>
        <h1>Register Page</h1>

        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" />
        </Form.Item>

        <div className='d-flex justify-content-between align-items-center'>
          <Link to='/login'>Already registered? Click here to login</Link>
          <button className='btn btn-primary'>Register</button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
