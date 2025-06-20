import React, { useState, useEffect } from "react";
import BetForm from "../components/BetForm";
import PlayerList from "../components/PlayerList";
import Leaderboard from "../components/Leaderboard";
import GameHistory from "../components/GameHistory";
import GameStatePanel from "../components/GameStatePanel";
import type {
  Player,
  GameState,
  RoundHistory,
  GameConstants,
} from "../types/game";
import { TbPokerChip } from "react-icons/tb";

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
}) => {
  const [betPlaced, setBetPlaced] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);
  const [gameConstants, setGameConstants] = useState<GameConstants | null>(
    null
  );
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${apiUrl}/game/constants`)
      .then((res) => res.json())
      .then(setGameConstants)
      .catch(console.error);
  }, []);
console.log(gameConstants)
  useEffect(() => {
    setBetPlaced(false);
    setCardIndex(0);
  }, [gameState.roundInProgress]);

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

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Player Info */}
          <div className="bg-gradient-to-r from-blue-800/80 to-purple-800/80 rounded-b-xl py-4 px-1 shadow-lg border border-gray-700">
            <div className="flex gap-4 justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white truncate text-ellipsis break-words">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="font-bold text-white text-nowrap">
                    Welcome, {player.name}
                  </h1>
                  <div className="w-fit px-3 py-1 bg-yellow-600/30 rounded-full text-yellow-300 text-sm font-medium">
                    ID: {player.id.slice(0, 6)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 rounded-full shadow-inner border border-yellow-400/30">
                {/* Colorful casino chip icon using react-icons */}
                <span className="h-7 w-7 flex items-center justify-center">
                  <TbPokerChip
                    size={28}
                    className="text-pink-400 drop-shadow"
                    style={{
                      background:
                        "radial-gradient(circle at 60% 40%, #fff 60%, #fde047 100%)",
                      borderRadius: "50%",
                    }}
                  />
                </span>
                <span className="ml-1 text-lg font-extrabold text-white bg-gradient-to-r from-yellow-300 via-white to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                  {chips.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="px-1 space-y-6">
            {/* Bet Form */}
            <BetForm
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              cardIndex={cardIndex}
              setCardIndex={setCardIndex}
              onPlaceBet={handlePlaceBet}
              message={message}
              selectionTime={
                gameConstants?.ROUND_DELAY
                  ? gameConstants.ROUND_DELAY / 1000
                  : selectionTime
              }
              betPlaced={betPlaced}
              disabled={isRevealing}
              revealCountdown={revealCountdown}
              showRedCard={showRedCard}
              redCard={redCard}
              roundId={gameState.currentRound}
              minBet={gameConstants?.MIN_BET}
              maxBet={gameConstants?.MAX_BET}
              cardCount={gameConstants?.NUM_CARDS as number || 5}
            />

            {/* Game State & Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GameStatePanel
                round={gameState.currentRound}
                pot={gameState.pot}
                redCard={showRedCard ? redCard : null}
                winners={winners}
              />
              <PlayerList
                players={gameState.players}
                currentPlayerId={player.id}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Leaderboard
              players={gameState.players}
              currentPlayerId={player.id}
            />
            <GameHistory history={history} noBetPlayers={noBetPlayers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
