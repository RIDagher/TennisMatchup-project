import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NewMatchForm from './NewMatchForm';

const MatchBoard = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //const [showForm, setShowForm] = useState(false);
  const [searchSkillLevel, setSearchSkillLevel] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        const data = await response.json();
        setMatches(data.data);

        setLoading(false);
      } catch (err) {
        setError('Error fetching matches.');
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleNewMatch = (newMatch) => {
    setMatches((prevMatches) => [newMatch, ...prevMatches]);
  };
  const handleCancel = async (matchId) => {
    // API call to canscel match...
  };

  const handleJoin = async (matchId) => {
    alert('Player joined the match succefully');
    // API call to join a match...
  };
  return (
    <Wrapper>
      <PageTitle>MatchBoard</PageTitle>

      <ContentWrapper>
        <FormSection>
          <Title>Create a Match</Title>
          <NewMatchForm onNewMatch={handleNewMatch} />
        </FormSection>

        <MatchesSection>
          {loading && <p>Loading...</p>}
          {error && <Message>{error}</Message>}
          <SearchBar>
            <Input
              placeholder="Search by Skill Level"
              value={searchSkillLevel}
              onChange={(e) => setSearchSkillLevel(e.target.value)}
            />
            <Input
              placeholder="Search by Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </SearchBar>

          <MatchesList>
            <Title>Active Match List</Title>
            <MatchCard>
              {matches
                .filter((match) => match.skillLevel.includes(searchSkillLevel))
                .filter((match) => match.address.includes(searchLocation))
                .map((match) => (
                  <Container key={match._id}>
                    <MatchItem>
                      <p>Name: {match.player} </p>
                      <p>Type: {match.type} </p>
                      <p>Level: {match.skillLevel}</p>
                      <p>Date: {match.dateTime} </p>
                      <p>Location: {match.address} </p>

                      <JoinButton onClick={() => handleJoin(match._id)}>
                        Join Match
                      </JoinButton>
                      <CancelButton onClick={() => handleCancel(match._id)}>
                        Cancel
                      </CancelButton>
                    </MatchItem>
                  </Container>
                ))}
            </MatchCard>
          </MatchesList>
        </MatchesSection>
      </ContentWrapper>
    </Wrapper>
  );
};
const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  flex: 1;
`;

const PageTitle = styled.h2`
  color: #009fdb;
  font-size: 30px;
  margin-bottom: 20px;
  text-align: center;
  margin-top: 10px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
`;

const FormSection = styled.div`
  flex: 1;
  padding: 20px;
`;

const MatchesSection = styled.div`
  flex: 2;
  padding: 10px;
  overflow-y: auto;
`;
const Wrapper = styled.div``;

const Title = styled.h3`
  padding-bottom: 10px;
  text-align: center;
  color: #007b9e;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7fcfc;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Message = styled.div``;

const MatchesList = styled.div`
  /* Styling for the matches list container */
`;

const MatchItem = styled.div`
  /* Styling for individual match items */
  // Arrange children vertically
  align-items: start; // Align items to the left
  width: 100%; // Take full width of the container
  padding: 10px;
`;

const MatchCard = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // Spacing between the cards
  border-radius: 10px;
  width: px;
`;

const JoinButton = styled.button`
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

  &:active {
    transform: translateY(1px);
  }
`;
const CancelButton = styled.button`
  margin: 10px;
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

  &:active {
    transform: translateY(1px);
  }
`;

export default MatchBoard;
