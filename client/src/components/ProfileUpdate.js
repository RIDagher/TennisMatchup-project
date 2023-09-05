import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import styled from 'styled-components';

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const { userDetails, setUserDetails, token } = useAuth();

  const [formData, setFormData] = useState({
    skillLevel: '',
    location: '',
    profilePicture: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (userDetails) {
      setFormData(userDetails);
    }
  }, [userDetails]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { _id, ...restOfUserDetails } = userDetails; // Destructure _id out
    const updatedData = {
      ...formData, // Spread the formData
      ...restOfUserDetails, // Add the rest of userDetails, excluding _id
    };

    console.log('Initiating profile update for user:', updatedData);

    // Extract the token from the local storage
    //const token = localStorage.getItem('authToken');
    console.log('Token from localStorage:', token);

    try {
      const response = await fetch(`/api/users/${updatedData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      console.log(
        'Response status:',
        response.status,
        'Response status text:',
        response.statusText
      );

      const data = await response.json();
      console.log('Response data:', data);

      if (response.status === 200) {
        console.log('Profile updated successfully!');
        setSuccess('Profile updated successfully!'); // Set the success message.
        setUserDetails(updatedData); // Update the userDetails in the context.
      } else {
        console.error('Error updating profile. Status code:', response.status);
        setError(data.message || 'Error updating profile.'); // Set the error state.
      }
    } catch (error) {
      console.error('Error in updateProfile function:', error);
      throw error;
    }
  };
  return (
    <Wrapper>
      <Title>Update Profile</Title>
      {error && <Message style={{ color: 'red' }}>{error}</Message>}
      {success && <Message style={{ color: 'green' }}>{success}</Message>}
      <FormT onSubmit={handleSubmit}>
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

        <Button type="submit">Update</Button>
      </FormT>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #009fdb, #00c49a);
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h2`
  color: #fff;
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

export default ProfileUpdate;
