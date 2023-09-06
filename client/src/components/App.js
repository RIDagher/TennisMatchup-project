//import React, { useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import MatchBoard from './MatchBoard';
import { AuthProvider } from './AuthContext';
import PlayersPage from './PlayersPage';
import ProfileUpdate from './ProfileUpdate';
import CourtsPage from './CourtsPage';
import PostCourt from './PostCourt';

const App = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/courts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.status !== 200) {
          throw new Error(result.message || 'Error fetching data!');
        }

        setCourts(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Header />

        <Main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/update-profile" element={<ProfileUpdate />} />
            <Route path="/homepage" element={<Home courts={courts} />} />
            <Route path="/playersPage" element={<PlayersPage />} />
            <Route
              path="/courtsPage"
              element={
                <CourtsPage courts={courts} loading={loading} error={error} />
              }
            />
            <Route path="/PostCourt" element={<PostCourt />} />
            <Route path="/matchboard" element={<MatchBoard />} />
            <Route path="/add-court" element={<PostCourt />} />
          </Routes>
        </Main>
      </BrowserRouter>
    </AuthProvider>
  );
};

const Main = styled.div``;

export default App;
