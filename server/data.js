const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    hashedPassword:
      '$2b$10$GlHyCTv21YANYb8fjohRa.TQsiZYvZDCOU9k9GxTr0S30ad3yXRaS', // This should be hashed
    profilePicture: 'public/assets/IMG_3094.jpg',
    skillLevel: 'Intermediate',
    location: 'Montreal',
  },
  // ... more users
  {
    firstName: 'Mickey',
    lastName: 'Mouse',
    email: 'Mickey@example.com',
    hashedPassword:
      '$2b$10$K/6y19MOfAfLf4pCmOIw8.yF40tmlAO55h/FmN94Gqw6wdMZjabD2', // This should be hashed
    profilePicture: 'public/assets/Mickey.avif',
    skillLevel: 'Beginner',
    location: 'Montreal',
  },
];

module.exports = { users };
