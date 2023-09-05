import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

import styled from 'styled-components';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 45.5017,
  lng: -73.5673,
  zoom: 50,
};

const Home = ({ courts }) => {
  console.log(courts);
  const [apiKey, setApiKey] = useState('');

  // const onLoad = (marker) => {
  //   console.log('marker: ', marker);
  // };

  useEffect(() => {
    // Fetch the API key from the backend
    const fetchAPIKey = async () => {
      try {
        const response = await fetch('/api/googlemapsapikey');
        if (response.ok) {
          const data = await response.json();
          setApiKey(data.apiKey);
        } else {
          console.error(
            'Failed to fetch API key, HTTP status:',
            response.status
          );
        }
      } catch (error) {
        console.error('Error fetching API Key:', error);
      }
    };

    fetchAPIKey();
  }, []);
  if (courts.length === 0) {
    return <p>Loading</p>;
  }

  return (
    <StyledMapContainer>
      {apiKey && (
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13} // Initial zoom level to focus on Montreal
            options={{
              styles: [
                {
                  featureType: 'poi',
                  stylers: [{ visibility: 'off' }],
                },
              ],
              // Users can zoom in more for more detail
            }}
          >
            {courts.map((court) => {
              if (court.location?.lat && court.location?.lng) {
                console.log(
                  'Coordinates for',
                  court.name,
                  'Lat:',
                  court.location.lat,
                  'Lng:',
                  court.location.lng
                );
                return (
                  <MarkerF
                    key={court._id}
                    position={{
                      lat: parseFloat(court.location.lat),
                      lng: parseFloat(court.location.lng),
                    }}
                    title={court.name}
                  />
                );
              }
              return null; // Return null for courts without valid location data
            })}
          </GoogleMap>
        </LoadScript>
      )}
    </StyledMapContainer>
  );
};

const StyledMapContainer = styled.div`
  height: 600px;
  border: 2px solid #333; // A border
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // A shadow
`;

export default Home;
