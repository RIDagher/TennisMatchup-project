import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CourtsPage = ({ courts, loading, error }) => {
  return (
    <Container>
      <Title>Tennis Courts</Title>
      <StyledLink to="/add-court">
        <AddCourtButton>Add New Court</AddCourtButton>
      </StyledLink>
      <CourtsList>
        {courts.map((court) => {
          const photoURL =
            court.photos && court.photos[0]
              ? `http://localhost:8000/assets/${court.photos[0].replace(
                  'public/assets/',
                  ''
                )}`
              : null;

          console.log(photoURL);

          return (
            <CourtCard key={court._id}>
              {photoURL && (
                <CourtImage src={photoURL} alt={court.name} />
                // Displaying only the first photo
              )}

              <CourtName>{court.name}</CourtName>
              <CourtInfo>Type: {court.indoorOrOutdoor}</CourtInfo>
              <CourtInfo>Opening Hours: {court.openingHours}</CourtInfo>
              <CourtInfo>Address: {court.address}</CourtInfo>
            </CourtCard>
          );
        })}
      </CourtsList>
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

const CourtsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 60%;
`;

const Title = styled.h2`
  color: #4a56a5;
  font-size: 30px;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50%;
`;

const CourtCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
`;

const CourtImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  border: 1px solid;
`;

const CourtName = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const CourtInfo = styled.p`
  font-size: 16px;
  color: ${(props) => props.color || 'black'};
  margin-bottom: 5px;
`;

const AddCourtButton = styled.button`
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 20px;

  &:hover {
    background-color: #555;
  }
`;
export default CourtsPage;
