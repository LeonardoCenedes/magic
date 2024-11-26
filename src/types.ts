export interface User {
  id: string; // UUID as string
  username: string;
  email: string;
  password_hash: string;
}

export interface Deck {
  id: string;
  user_id: string;
  name: string;
}

export interface SynergyScore {
  id: number;
  deck_id: string;
  synergy_score: string;
  calculated_at: string;
}

export interface DeckCard {
  id: number;
  deck_id: string;
  card_id: string;
  quantity: number;
}