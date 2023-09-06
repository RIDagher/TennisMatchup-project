import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NewMatchForm from './NewMatchForm';

const MatchBoard = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('api/matches');
        const data = await response.json();
        setMatches(data.matches);
        setLoading(false);
      } catch (err) {
        setError('Error fetching matches.');
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleJoin = async (matchId) => {
    // API call to join a match...
  };
  return (
    <Wrapper>
      <Title>Match Board</Title>
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create a New Match'}
      </Button>

      {showForm && <NewMatchForm />}
      {loading && <p>Loading...</p>}
      {error && <Message>{error}</Message>}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  /* Styling for the main wrapper */
`;

const Title = styled.h2`
  /* Styling for the title */
`;

const Message = styled.div`
  /* Styling for error messages, maybe with a red font */
`;

const MatchesList = styled.div`
  /* Styling for the matches list container */
`;

const MatchItem = styled.div`
  /* Styling for individual match items */
`;

const Button = styled.button``;
export default MatchBoard;
