import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { User } from './types';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: black;
    color: white;
    font-family: Arial, sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid white;
  color: white;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: white;
    opacity: 0.7;
  }
`;

const Button = styled.button`
  padding: 10px;
  margin: 10px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: darkgray;
  }
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      const response = await axios.get(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/users/email/${email}`);
      if (response.status === 201) {
        const user: User = response.data;
        setUser(user);
        console.log('Login response:', user);
        // Handle successful login here
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login error here
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Input
          type="text"
          placeholder="Login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={() => navigate('/register')}>Registrar</Button>
      </Container>
    </>
  );
};

export default Login;