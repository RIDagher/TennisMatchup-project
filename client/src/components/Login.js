import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styled from 'styled-components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { setIsAuthenticated, setUserDetails, saveToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        //after successful login:

        saveToken(data.token);
        setIsAuthenticated(true);
        setUserDetails(data.user);
        setSuccess('Successfully logged in!');
        navigate('/homepage'); // navigate to homepage or dashboard after successful login
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <Wrapper>
      <ImageWrapper>
        <TennisImage src="/assets/login-background.jpeg" alt="Tennis" />
      </ImageWrapper>
      <FormWrapper>
        <Title>Login</Title>
        {error && <Message style={{ color: 'red' }}>{error}</Message>}
        {success && <Message style={{ color: 'green' }}>{success}</Message>}

        <FormT onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">Login</Button>
        </FormT>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  /* Reverse the order to display the image on the right and the form on the left */
  align-items: center;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;
const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  width: 50%;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`;
const TennisImage = styled.img`
  max-width: 70%;
  max-height: 90%;
`;

const Title = styled.h2`
  color: #009fdb;
  margin-bottom: 20px;
`;

const Message = styled.div`
  width: 80%;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.error ? '#e74c3c' : '#2ecc71')};
  color: #fff;
`;

const FormT = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  flex: 1;
`;

const Input = styled.input`
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #009fdb;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #007b9e;
  }
`;

export default Login;
