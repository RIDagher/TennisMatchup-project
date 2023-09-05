import React from 'react';
import styled from 'styled-components';

const ContactPage = () => {
  return (
    <ContactContainer>
      <FormTitle>Contact Us</FormTitle>
      <ContactForm>
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Subject" required />
        <textarea placeholder="Message" required></textarea>
        <SubmitButton type="submit">Send</SubmitButton>
      </ContactForm>
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background-color: #f8f8f8;
  border-radius: 10px;
`;

const FormTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  input,
  textarea {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  textarea {
    height: 100px;
    resize: none;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;

export default ContactPage;
