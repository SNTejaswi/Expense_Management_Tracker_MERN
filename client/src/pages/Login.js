import React, { useState,useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const SubmitHandler = async (values) => {
    try {
      setLoading(true);

      // Use full backend URL
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/users/login",
        values
      );

      setLoading(false);
      message.success('Login successful');

      // Store user data without password
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));

      // Navigate to home page
      navigate('/');
    } catch (error) {
      setLoading(false);
      message.error(error.response?.data?.message || 'Invalid UserName or Password');
    }

    console.log(values); // optional: remove in production
  };
useEffect(()=>{
  if(localStorage.getItem('user')){
    navigate('/')
  }
},[navigate]
);
  return (

    <div className="register-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={SubmitHandler}>
        <h1>Login Page</h1>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input type="password" />
        </Form.Item>

        <div className="d-flex justify-content-between align-items-center">
          <Link to="/register">Not a user? Register here</Link>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
