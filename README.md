TennisMatch Platform

A tennis application allowing users to discover courts, schedule matches, and connect with players.

Features:

User Authentication: Secure login for users.
Court Posting: Users can post new tennis courts with details.
MatchBoard: View all available matches and search based on skill level and location.
NewMatchForm: Schedule a new match by setting a date, time, skill level, and type.
Google Maps Integration: View and discover tennis courts on an interactive map.

Frontend:

Built with React

Components:
Login: User authentication.
PostCourt: Allows users to add tennis court details.
MatchBoard: Displays available matches with search capabilities.
NewMatchForm: Interface for scheduling a new match.

Context:
AuthContext: Manages user authentication state and operations.
UseHooks:

Backend:

Built with Node.js, Express.js, and MongoDB

Routes:
login: Handles user authentication.
courts: Endpoint for adding and retrieving tennis court details.
matches: Endpoint for creating and fetching tennis match details.

Middleware:

auth: Ensures that the user is authenticated.

Controllers:
authController: Manages user registration, login, and token verification.
courtController: Handles CRUD operations for tennis courts.
matchController: Handles CRUD operations for tennis matches.
