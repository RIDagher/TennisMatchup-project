import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import styled from 'styled-components';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 45.5017,
  lng: -73.5673,
};

const Home = ({ courts }) => {
  const [apiKey, setApiKey] = useState('');
  const [isMapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  const vibrantStyles = [
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#d3e0ea',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#f3c623',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#f3c623',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a5d7a9',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#7dcc93',
        },
      ],
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#f4f4f4',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#fdfdfd',
        },
      ],
    },
  ];

  useEffect(() => {
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

  const getMarkerIcon = () => ({
    url: '/assets/racket1.avif',
    size: new window.google.maps.Size(40, 40),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(16, 16),
    scaledSize: new window.google.maps.Size(32, 32),
  });

  return (
    <StyledMapContainer>
      {apiKey && (
        <LoadScript
          googleMapsApiKey={apiKey}
          onLoad={() => setMapsApiLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
              minZoom: 10,
              maxZoom: 20,
              styles: vibrantStyles,
            }}
          >
            {isMapsApiLoaded &&
              courts.map((court) => {
                if (court.location?.lat && court.location?.lng) {
                  return (
                    <Marker
                      key={court._id}
                      position={{
                        lat: parseFloat(court.location.lat),
                        lng: parseFloat(court.location.lng),
                      }}
                      title={court.name}
                      icon={getMarkerIcon()}
                      onClick={() => setSelectedCourt(court)}
                    />
                  );
                }
                return null;
              })}

            {selectedCourt && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedCourt.location.lat),
                  lng: parseFloat(selectedCourt.location.lng),
                }}
                onCloseClick={() => setSelectedCourt(null)}
              >
                <div>
                  <h4>{selectedCourt.name}</h4>
                  <p>{selectedCourt.address}</p>
                  <p>{selectedCourt.indoorOrOutdoor}</p>

                  {/* TO add more court details here */}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </StyledMapContainer>
  );
};

const StyledMapContainer = styled.div`
  height: 600px;
  border: 2px solid #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export default Home;
