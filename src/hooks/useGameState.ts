import { useState } from "react";
import type { GameState, Player, PlayerBetResult, RoundHistory } from "../types/game";

export function useGameState() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [cardIndex, setCardIndex] = useState(1);
  const [message, setMessage] = useState("");
  const [winners, setWinners] = useState<string[]>([]);
  const [redCard, setRedCard] = useState<number | null>(null);
  const [joining, setJoining] = useState(false);
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState<RoundHistory[]>([]);
  const [connectionError, setConnectionError] = useState("");
  const [betResults, setBetResults] = useState<PlayerBetResult[]>([]);

  return {
    player,
    setPlayer,
    gameState,
    setGameState,
    betAmount,
    setBetAmount,
    cardIndex,
    setCardIndex,
    message,
    setMessage,
    winners,
    setWinners,
    redCard,
    setRedCard,
    joining,
    setJoining,
    connected,
    setConnected,
    history,
    setHistory,
    connectionError,
    setConnectionError,
    betResults,
    setBetResults,
  };
}
