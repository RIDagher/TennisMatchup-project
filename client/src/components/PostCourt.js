import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styled from 'styled-components';

const PostCourt = () => {
  const initialFormData = {
    name: '',
    indoorOrOutdoor: '',
    openingHours: '',
    address: '',
    photos: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated, token } = useAuth();

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!isAuthenticated) {
      setError('Please log in to post a court.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    console.log('Token from localStorage:', token);
    try {
      const response = await fetch('/api/courts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (result.acknowledged) {
        setFormData(initialFormData);
        setSuccess('Court added successfully!');
      } else {
        setError(result.error || 'Failed to post court');
      }
    } catch (error) {
      console.error('Error during the fetch operation:', error);
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
      photos: e.target.files,
    }));
  };
  return (
    <Wrapper>
      <Title>Add a New Court</Title>
      {error && <Message style={{ color: 'red' }}>{error}</Message>}
      {success && <Message style={{ color: 'green' }}>{success}</Message>}
      <FormCourt onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Court Name:</Label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>Court Type:</Label>
          <Input
            name="indoorOrOutdoor"
            value={formData.indoorOrOutdoor}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Openning Hours:</Label>
          <Input
            name="openingHours"
            value={formData.openingHours}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Location:</Label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Photos:</Label>
          <Input type="file" name="photos" onChange={handleFileChange} />
        </FormGroup>
        <Button type="submit">Add Court</Button>
      </FormCourt>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-image: url('/assets/background-court.jpeg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
`;
const Title = styled.h2`
  color: #fff;
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

const FormCourt = styled.form`
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

const Select = styled.select`
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

export default PostCourt;
