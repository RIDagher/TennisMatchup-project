import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PlayersPage = () => {
  // State for all players, filtered players, loading, and error states
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search filters
  const [searchLocation, setSearchLocation] = useState('');
  const [searchSkill, setSearchSkill] = useState('');

  // Fetch players data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === 200 && result.data) {
          setPlayers(result.data);
        } else {
          throw new Error(result.message || 'Error fetching data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Function to get color based on skill level
  const getSkillColor = (level) => {
    switch (level) {
      case '-70':
      case '-60':
      case '-50':
        return '#4CAF50'; // green for beginners
      case '-40':
      case '-30':
        return '#FFC107'; // amber for intermediates
      case '-20':
      case '-10':
      case '0':
      case '+10':
        return '#FF5722'; // deep orange for advanced
      default:
        return '#9E9E9E'; // grey
    }
  };

  // List of skill levels for dropdown
  const skillLevels = [
    '-70',
    '-60',
    '-50',
    '-40',
    '-30',
    '-20',
    '-10',
    '0',
    '+10',
  ];

  // Filter players based on search criteria
  useEffect(() => {
    const filterPlayers = () => {
      let tempPlayers = [...players];
      if (searchLocation) {
        tempPlayers = tempPlayers.filter((player) =>
          player.location.includes(searchLocation)
        );
      }
      if (searchSkill) {
        tempPlayers = tempPlayers.filter(
          (player) => player.skillLevel === searchSkill
        );
      }
      setFilteredPlayers(tempPlayers);
    };
    filterPlayers();
  }, [players, searchLocation, searchSkill]);

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Title>Tennis Players</Title>

      <SearchContainer>
        <input
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <select
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
        >
          <option value="">Select Skill Level</option>
          {skillLevels.map((level) => (
            <option
              key={level}
              value={level}
              style={{ color: getSkillColor(level) }}
            >
              {level}
            </option>
          ))}
        </select>
      </SearchContainer>

      <PlayersList>
        {filteredPlayers.map((player) => (
          <PlayerCard key={player._id}>
            {player.profilePicture && player.profilePicture !== 'null' && (
              <PlayerImage
                src={`http://localhost:8000/assets/${player.profilePicture.replace(
                  'public/assets/',
                  ''
                )}`}
                alt={player.firstName}
              />
            )}
            <PlayerInfoContainer>
              <PlayerName>
                {player.firstName} {player.lastName}
              </PlayerName>
              <PlayerInfo>{player.email}</PlayerInfo>
              <PlayerInfo color={getSkillColor(player.skillLevel)}>
                Level: {player.skillLevel}
              </PlayerInfo>
              <PlayerInfo>Location: {player.location}</PlayerInfo>
            </PlayerInfoContainer>
          </PlayerCard>
        ))}
      </PlayersList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;

  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

const Title = styled.h2`
  color: #009fdb;
  font-size: 30px;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const PlayersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 60%;
`;

const PlayerCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
`;

const PlayerImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  border: 1px solid;
`;

const PlayerInfoContainer = styled.div``;

const PlayerName = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const PlayerInfo = styled.p`
  font-size: 16px;
  color: ${(props) => props.color || 'black'};
  margin-bottom: 5px;
`;

export default PlayersPage;
