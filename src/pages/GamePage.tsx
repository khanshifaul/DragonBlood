import React, { useEffect, useState } from "react";
import { TbPokerChip } from "react-icons/tb";
import BetForm from "../components/BetForm";
import GameHistory from "../components/GameHistory";
import GameStatePanel from "../components/GameStatePanel";
import Leaderboard from "../components/Leaderboard";
import PlayerList from "../components/PlayerList";
import type { GameConstants, GameState, Player, RoundHistory } from "../types/game";

interface GamePageProps {
  player: Player;
  gameState: GameState;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  cardIndex: number;
  setCardIndex: (index: number) => void;
  onPlaceBet: () => void;
  message: string;
  winners: string[];
  redCard: number | null;
  history: RoundHistory[];
  chips: number;
  noBetPlayers: string[];
  showRedCard: boolean;
  betResults?: import("../types/game").PlayerBetResult[];
}

const selectionTime = 10; // seconds for card selection

const GamePage: React.FC<GamePageProps> = ({
  player,
  gameState,
  betAmount,
  setBetAmount,
  cardIndex,
  setCardIndex,
  onPlaceBet,
  message,
  winners,
  redCard,
  history,
  chips,
  noBetPlayers,
  showRedCard,
  betResults = [],
}) => {
  const [betPlaced, setBetPlaced] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);
  const [gameConstants, setGameConstants] = useState<GameConstants | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!apiUrl) {
      console.error("[GamePage] VITE_API_URL is not set. Skipping fetch for game constants.");
      return;
    }
    fetch(`${apiUrl}/game/constants`)
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return res.text().then((text) => {
            console.error("[GamePage] Non-JSON response from /game/constants:", text);
            throw new Error("Non-JSON response from /game/constants");
          });
        }
        return res.json();
      })
      .then(setGameConstants)
      .catch((err) => {
        console.error("[GamePage] Failed to fetch game constants:", err);
      });
  }, [apiUrl]);
  // console.log(gameConstants);
  useEffect(() => {
    setBetPlaced(false);
    setCardIndex(0);
  }, [gameState.roundInProgress, setCardIndex]);

  useEffect(() => {
    if (gameState.roundInProgress) {
      setIsRevealing(false);
      setRevealCountdown(null);
    }
  }, [gameState.roundInProgress]);

  const handlePlaceBet = () => {
    if (!betPlaced) {
      onPlaceBet();
      setBetPlaced(true);
    }
  };

  // Find this player's bet results for the round
  const myBetResults = betResults.find((r) => r.playerId === player.id)?.bets || [];

  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 gap-6'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Player Info */}
          <div className='bg-gradient-to-r from-blue-800/80 to-purple-800/80 rounded-b-xl py-4 px-1 shadow-lg border border-gray-700'>
            <div className='flex gap-4 justify-between items-center'>
              <div className='flex gap-4 items-center'>
                <div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white truncate text-ellipsis break-words'>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className='font-bold text-white text-nowrap'>Welcome, {player.name}</h1>
                  <div className='w-fit px-3 py-1 bg-yellow-600/30 rounded-full text-yellow-300 text-sm font-medium'>
                    ID: {player.id.slice(0, 6)}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 rounded-full shadow-inner border border-yellow-400/30'>
                {/* Colorful casino chip icon using react-icons */}
                <span className='h-7 w-7 flex items-center justify-center'>
                  <TbPokerChip
                    size={28}
                    className='text-pink-400 drop-shadow'
                    style={{
                      background: "radial-gradient(circle at 60% 40%, #fff 60%, #fde047 100%)",
                      borderRadius: "50%",
                    }}
                  />
                </span>
                <span className='ml-1 text-lg font-extrabold bg-gradient-to-r from-yellow-300 via-white to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide'>
                  {chips.toLocaleString()} chips
                </span>
                <span className='ml-4 text-lg font-bold text-yellow-400'>Pot: {gameState.pot.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className='px-1 space-y-6'>
            {/* Bet Form */}
            <BetForm
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              cardIndex={cardIndex}
              setCardIndex={setCardIndex}
              onPlaceBet={handlePlaceBet}
              message={message}
              selectionTime={gameConstants?.ROUND_DELAY ? gameConstants.ROUND_DELAY / 1000 : selectionTime}
              betPlaced={betPlaced}
              disabled={isRevealing}
              revealCountdown={revealCountdown}
              showRedCard={showRedCard}
              redCard={redCard}
              roundId={gameState.currentRound}
              minBet={gameConstants?.MIN_BET}
              maxBet={gameConstants?.MAX_BET}
              cardCount={(gameConstants?.NUM_CARDS as number) || 5}
              betSummary={myBetResults}
            />

            {/* Game State & Players */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <GameStatePanel
                round={gameState.currentRound}
                pot={gameState.pot}
                redCard={showRedCard ? redCard : null}
                winners={winners}
              />
              <PlayerList players={gameState.players} currentPlayerId={player.id} />
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            <Leaderboard players={gameState.players} currentPlayerId={player.id} />
            <GameHistory history={history} noBetPlayers={noBetPlayers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
