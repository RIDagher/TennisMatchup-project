import React, { useState } from 'react';
import DateTimePicker from 'react-datetime';
import { useAuth } from './AuthContext';
import styled from 'styled-components';

const NewMatchForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [dateTime, setDateTime] = useState(new Date());
  const [address, setAddress] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [type, setType] = useState('');
  const [organaizer, setOrganizer] = useState('');

  const { isAuthenticated, token, userDetails } = useAuth();

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!dateTime || !address || !skillLevel || !type || !organaizer) {
      setError('Please fill in all the fields.');
      return;
    }
    if (!isAuthenticated) {
      setError('Please log in to create a Match');
      return;
    }

    //Api call to create a match
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateTime,
          address,
          skillLevel,
          type,
          organaizer: userDetails.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create match.');
      }
      setSuccess('Match created successfully! ');
    } catch (err) {
      setError(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <DateTimePicker onChange={setDateTime} value={dateTime} />

      <Input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Select
        value={skillLevel}
        onChange={(e) => setSkillLevel(e.target.value)}
      >
        <option value="">Select Skill Level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </Select>

      <Select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select Match Type</option>
        <option value="single">Single</option>
        <option value="double">Double</option>
      </Select>

      <Button type="submit">Create Match</Button>
    </Form>
  );
};

// ... [Your other imports and main component logic]

const Form = styled.form`
  background: url('assets/racket1.avif') no-repeat center center;
  background-size: cover;
  padding: 20px;
  border-radius: 15px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background: #f4d1ae; // Soft peachy color
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e9bc9a; // Slightly darker peach on hover
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9); // Slightly transparent background
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.9);
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 10px;
`;

export default NewMatchForm;