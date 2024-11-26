import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DeckCard } from './types';

const OuterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #000;
  color: white;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 90%;
  max-width: 1920px;
  margin: 20px;
  border: 2px solid white;
  border-radius: 16px;
  overflow: hidden;
`;

const Rectangle = styled.div`
  width: 30%;
  height: 100%;
  background-color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2px solid white;
  overflow-y: auto;
`;

const RectangleContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

const Square = styled.div`
  width: 70%;
  height: 100%;
  background-color: black;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
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
  margin: 10px 0;
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

const Card = styled.div<{ imageUrl?: string }>`
  width: 140px;
  height: 200px;
  padding: 20px;
  margin: 10px;
  background-color: white;
  background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  &:hover {
    background-color: darkgray;
  }
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DeckBuilder: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const fetchDeckCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/decks/${deckId}/cards`);
        const deckCards: DeckCard[] = response.data;

        const cardPromises = deckCards.map(async (deckCard) => {
          const cardResponse = await axios.get(`https://api.scryfall.com/cards/${deckCard.card_id}`);
          return cardResponse.data;
        });

        const fetchedCards = await Promise.all(cardPromises);
        setCards(fetchedCards);
      } catch (error) {
        console.error('Error fetching deck cards:', error);
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchDeckCards();
    }
  }, [deckId]);

  useEffect(() => {
    const fetchCards = async (url: string) => {
      try {
        setLoading(true); // Ensure loading is activated
        const response = await axios.get(url);
        setCards(prevCards => [...prevCards, ...response.data.data]);
        setNextPage(response.data.next_page); // Update next page correctly
        setHasMore(response.data.has_more); // Update pagination status
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false); // Ensure loading is deactivated
      }
    };

    if (!initialFetchDone && hasMore !== false && !nextPage && !searchTerm) {
      fetchCards('https://api.scryfall.com/cards/search?q=cmc=1');
      setInitialFetchDone(true);
    } else if (hasMore && nextPage) {
      fetchCards(nextPage);
    }
  }, [nextPage, hasMore, initialFetchDone]);

  const handleAddCard = async (cardId: string, imageUrl: string) => {
    try {
      await axios.post(`https://18d6-131-100-68-191.ngrok-free.app/api/v1/decks/${deckId}/cards`, {
        card_id: cardId,
        quantity: 1,
      });
      setSelectedCards([...selectedCards, imageUrl]);
    } catch (error) {
      console.error('Error adding card to deck:', error);
    }
  };

  const handleRemoveCard = (index: number) => {
    setSelectedCards(selectedCards.filter((_, i) => i !== index));
  };

  const handleSearch = async () => {
    setCards([]);
    try {
      setLoading(true);
      const response = await axios.get(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}`);
      const newCards = response.data.data;

      const newCardIds = new Set<string>(newCards.map((card: any) => card.id));
      setCards(prevCards => prevCards.filter(card => newCardIds.has(card.id)).concat(newCards));
    } catch (error) {
      console.error('Error searching card:', error);
      setCards([]); // Ensure state is cleared in case of error
    } finally {
      setLoading(false); // Ensure loading is deactivated
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      // If the input is cleared, call the original API to fetch the cards again
      setLoading(true);
      setCards([]);
      setNextPage(null);
      setHasMore(true);
      setInitialFetchDone(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom && hasMore) {
      setNextPage(nextPage);
    }
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <OuterContainer>
      <Container>
        <Rectangle onScroll={handleScroll}>
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <Input
              type="text"
              placeholder="Procurar"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <Button onClick={handleSearch}>Procurar</Button>
          </div>
          <RectangleContent>
            {filteredCards.length === 0 && !loading && <p>Nenhuma carta encontrada</p>}
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                imageUrl={card.image_uris?.normal}
                onClick={() => handleAddCard(card.id, card.image_uris.normal)}
              >
                {!card.image_uris?.normal && <span>{card.name}</span>}
              </Card>
            ))}
            {loading && <Loader />}
          </RectangleContent>
        </Rectangle>
        <Square>
          {selectedCards.map((card, index) => (
            <Card
              key={index}
              imageUrl={card}
              onClick={() => handleRemoveCard(index)}
            />
          ))}
        </Square>
      </Container>
    </OuterContainer>
  );
};

export default DeckBuilder;