import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import { Deck, SynergyScore } from './types';

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
  height: 90%;
  max-width: 1920px;
  margin: 20px;
  border: 2px solid white;
  border-radius: 16px;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Input = styled.input`
  width: 200px;
  padding: 10px;
  margin: 10px;
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

const DeckContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const DeckButton = styled.div`
  width: 140px;
  height: 200px;
  padding: 20px;
  margin: 10px;
  background-color: white;
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 16px;

  &:hover {
    background-color: darkgray;
  }
`;

const DeleteButton = styled.button`
  padding: 10px;
  margin: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: darkred;
  }
`;

const Decks: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [synergyScores, setSynergyScores] = useState<{ [key: string]: string }>({});
  const [newDeckName, setNewDeckName] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDecks = async () => {
    if (user) {
      try {
        const response = await axios.get(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/decks/user/${user.id}`);
        if (Array.isArray(response.data)) {
          setDecks(response.data);
        } else {
          console.error('Error: API response is not an array');
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    }
  };

  const fetchSynergyScores = async () => {
    for (const deck of decks) {
      try {
        const response = await axios.get(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/decks/${deck.id}/synergy-score`);
        const synergyScore: SynergyScore = response.data;
        setSynergyScores(prevScores => ({ ...prevScores, [deck.id]: synergyScore.synergy_score }));
      } catch (error) {
        console.error(`Error fetching synergy score for deck ${deck.id}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [user]);

  useEffect(() => {
    if (decks.length > 0) {
      fetchSynergyScores();
    }
  }, [decks]);

  useEffect(() => {
    fetchDecks();
    fetchSynergyScores();
  }, [location]);

  const handleAddDeck = async () => {
    console.log('User:', user);
    console.log('Adding deck:', newDeckName);
    if (user && newDeckName) {
      try {
        const response = await axios.post(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/decks/`, {
          user_id: user.id,
          name: newDeckName,
        });
        console.log('Deck added successfully:', response.data);
        
        setNewDeckName(''); // Clear the input field
        await fetchDecks(); // Re-fetch decks
        await fetchSynergyScores(); // Re-fetch synergy scores
      } catch (error) {
        console.error('Error adding deck:', error);
      }
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      await axios.delete(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/decks/${deckId}`);
      setDecks(decks.filter(deck => deck.id !== deckId));
    } catch (error) {
      console.error(`Error deleting deck ${deckId}:`, error);
    }
  };

  const handleNavigateToDeckBuilder = (deckId: string) => {
    navigate(`/deckbuilder/${deckId}`);
  };

  return (
    <OuterContainer>
      <Container>
        <ButtonContainer>
          <Input
            type="text"
            placeholder="Nome do Deck"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
          />
          <Button onClick={handleAddDeck}>Novo</Button>
        </ButtonContainer>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {decks.map((deck) => (
            <DeckContainer key={deck.id}>
              <div>Sinergia: {synergyScores[deck.id]}</div>
              <DeckButton onClick={() => handleNavigateToDeckBuilder(deck.id)}>
                {deck.name}
              </DeckButton>
              <DeleteButton onClick={() => handleDeleteDeck(deck.id)}>Deletar</DeleteButton>
            </DeckContainer>
          ))}
        </div>
      </Container>
    </OuterContainer>
  );
};

export default Decks;