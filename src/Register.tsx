import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OuterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  border-radius: 16px;
  background-color: #000;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px;
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

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/v1/users/', {
        username: username,
        email: email,
        password_hash: senha,
      });
      if (response.status === 201) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error registering:', error);
      // Handle registration error here
    }
  };

  return (
    <OuterContainer>
      <Container>
        <Title>Registrar</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ButtonContainer>
          <Button onClick={handleRegister}>Registrar</Button>
        </ButtonContainer>
        {showPopup && <Popup>Sucesso</Popup>}
      </Container>
    </OuterContainer>
  );
};

export default Register;