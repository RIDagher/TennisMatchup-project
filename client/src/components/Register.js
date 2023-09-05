import React, { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Register = () => {
  const navigate = useNavigate();

  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    skillLevel: '',
    location: '',
    profilePicture: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.acknowledged) {
        setFormData(initialFormData);
        setSuccess('Successfully registered! Redirecting to login...'); //Set the success message
        setTimeout(() => {
          navigate('/login');
        }, 2000); //Navigate to login after 2 seconds
      } else {
        setError(result.error || 'An error occurred during registration.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: e.target.files[0],
    }));
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Title>Signup</Title>
        {error && <Message style={{ color: 'red' }}>{error}</Message>}
        {success && <Message style={{ color: 'green' }}>{success}</Message>}
        <FormT onSubmit={handleSubmit}>
          <FormGroup>
            <Label>First Name:</Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Last Name:</Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Skill Level (Handicap):</Label>
            <Select
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
            >
              <option value="-70">-70 (Novice)</option>
              <option value="-60">-60</option>
              <option value="-50">-50</option>
              <option value="-40">-40</option>
              <option value="-30">-30</option>
              <option value="-20">-20</option>
              <option value="-10">-10</option>
              <option value="0">0 (Professional)</option>
              <option value="10">+10 (Top Level)</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Location:</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Profile Picture:</Label>
            <Input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
          </FormGroup>
          <Button type="submit">Register</Button>
        </FormT>
      </FormWrapper>
      <ImageWrapper>
        <TennisImage src="/assets/player1.jpeg" alt="Tennis" />
      </ImageWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h2`
  color: #4a56a5;
  font-size: 40px;
  margin-bottom: 20px;
`;

const Message = styled.div`
  width: 70%;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.error ? '#e74c3c' : '#2ecc71')};
  color: #fff;
`;
const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  width: 50%; // Set width to 50% of the screen
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50%; // Set width to 50% of the screen
`;

const TennisImage = styled.img`
  max-width: 70%;
  max-height: 90%;
`;

const FormT = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
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
  border: 1px solid #fbfafb;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  outline: none;
  background-color: #fbfafb;
`;

const Select = styled.select`
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #4a56a5;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f4891d;
  }
`;

export default Register;
