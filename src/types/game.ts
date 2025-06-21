export interface Player {
  id: string;
  name: string;
  socketId: string;
  chips: number;
  currentBet?: {
    amount: number;
    cardIndex: number;
  };
  rewardsEarned: number;
  rewardsLost: number;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  cards: {
    redCardPosition?: number;
    revealed: boolean[];
  };
  pot: number;
  gameStarted: boolean;
  roundInProgress: boolean;
}

export interface RoundHistory {
  round: number;
  winners: string[];
  redCard: number;
  noBetPlayers?: string[];
}

export interface GameConstants {
  NUM_CARDS: number;
  INITIAL_CHIPS: number;
  MIN_BET: number;
  MAX_BET: number;
  ROUND_DELAY: number;
  REVEAL_DELAY: number;
}

export interface BetResult {
  cardIndex: number;
  amount: number;
  won: boolean;
  payout: number;
}

export interface PlayerBetResult {
  playerId: string;
  bets: BetResult[];
}
