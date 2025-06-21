import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import type { BetResult, GameState, Player, PlayerBetResult, RoundHistory } from "./types/game";

// Use relative path for socket.io to work with Vite proxy and LAN
const socket: Socket = io({
  path: "/socket.io",
  transports: ["websocket", "polling"],
});

function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [name, setName] = useState("");
  const [betAmount, setBetAmount] = useState(10);
  const [cardIndex, setCardIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [winners, setWinners] = useState<string[]>([]);
  const [redCard, setRedCard] = useState<number | null>(null);
  const [noBetPlayers, setNoBetPlayers] = useState<string[]>([]);
  const [joining, setJoining] = useState(false);
  const [connected, setConnected] = useState(socket.connected);
  const [history, setHistory] = useState<RoundHistory[]>([]);
  const [connectionError, setConnectionError] = useState("");
  const [chips, setChips] = useState(1000);
  const [showRedCard, setShowRedCard] = useState(false);
  const [betResults, setBetResults] = useState<PlayerBetResult[]>([]); // add type

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      setConnectionError("");
      console.log("[SOCKET] Connected to server");
    }
    function onDisconnect() {
      setConnected(false);
      setConnectionError("Disconnected from server.");
      console.log("[SOCKET] Disconnected from server");
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("gameState", (state: GameState) => {
      setGameState(state);
      // Update chips for the current player
      if (player) {
        const updated = state.players.find((p) => p.id === player.id);
        if (updated) setChips(updated.chips);
      }
    });
    socket.on("playerJoined", (playerData: Player) => {
      setPlayer(playerData);
      setChips(playerData.chips);
      setMessage("");
      setJoining(false);
    });
    socket.on("roundStarted", (state: GameState) => {
      setGameState(state);
      setWinners([]);
      setRedCard(null);
    });
    socket.on(
      "roundCompleted",
      ({
        gameState,
        winners,
        redCardPosition,
        noBetPlayers,
        betResults: results,
      }: {
        gameState: GameState;
        winners: string[];
        redCardPosition: number;
        noBetPlayers: string[];
        betResults: PlayerBetResult[];
      }) => {
        setGameState(gameState);
        setWinners(winners);
        setRedCard(redCardPosition);
        setNoBetPlayers(noBetPlayers || []);
        setBetResults(results || []);
        // Update chips based on betResults for this player
        if (player) {
          const myResult = (results || []).find((r: PlayerBetResult) => r.playerId === player.id);
          if (myResult) {
            const totalPayout = myResult.bets.reduce((sum: number, b: BetResult) => sum + b.payout, 0);
            setChips((chips) => chips + totalPayout);
          }
        }
        setHistory((prev) => [
          {
            round: gameState.currentRound,
            winners,
            redCard: redCardPosition,
            noBetPlayers,
          },
          ...prev.slice(0, 4),
        ]);
        // Start next round automatically after 3 seconds
        setTimeout(() => {
          socket.emit("startRound");
        }, 3000);
      }
    );
    socket.on("redCardRevealed", () => {
      setShowRedCard(true);
      setTimeout(() => setShowRedCard(false), 2000); // Hide after 2s
    });
    socket.on("betFailed", ({ message }) => {
      setMessage(message);
      if (message.includes("Name already taken")) setConnectionError(message);
    });
    socket.on("connect_error", (err) => {
      setMessage("Connection error: " + err.message);
      setConnectionError("Connection error: " + err.message);
      setConnected(false);
      console.error("[SOCKET ERROR]", err);
    });
    socket.on("betPlaced", (data) => {
      // Always update chips for the current player using chipsAfter from server
      if (player && (data.playerId === player.id || data.playerName === player.name)) {
        if (typeof data.chipsAfter === "number") {
          setChips(data.chipsAfter);
          console.log(`[BET PLACED] Chips updated: before=${data.chipsBefore}, after=${data.chipsAfter}`);
        } else if (typeof data.chips === "number") {
          setChips(data.chips);
          console.log(`[BET PLACED] Chips updated (legacy):`, data.chips);
        }
      }
    });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("gameState");
      socket.off("playerJoined");
      socket.off("roundStarted");
      socket.off("roundCompleted");
      socket.off("betFailed");
      socket.off("connect_error");
    };
  }, [player]);

  const joinGame = () => {
    if (name.trim().length < 2) {
      setMessage("Name must be at least 2 characters.");
      return;
    }
    setJoining(true);

    socket.emit("joinGame", name);
  };

  const placeBet = () => {
    if (betAmount < 2 || betAmount > 100) {
      setMessage("Bet must be between 2 and 100.");
      return;
    }
    if (cardIndex < 1 || cardIndex > 5) {
      // setMessage("Please setMessage a card.");
      return;
    }
    socket.emit("placeBet", { amount: betAmount, cardIndex });
    setMessage("");
  };

  const reconnect = () => {
    setConnectionError("");
    setMessage("");
    socket.connect();
  };

  return (
    <div className='w-full md:min-w-vw overflow-hidden min-h-svh bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center'>
      <div className='w-full container mx-auto rounded-xl'>
        {!player ? (
          <HomePage
            name={name}
            setName={setName}
            joining={joining}
            joinGame={joinGame}
            message={message}
            connected={connected}
            server={socket.io.engine.transport.name}
            connectionError={connectionError}
            onReconnect={reconnect}
          />
        ) : gameState ? (
          <GamePage
            player={player}
            gameState={gameState}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            cardIndex={cardIndex}
            setCardIndex={setCardIndex}
            onPlaceBet={placeBet}
            message={message}
            winners={winners}
            redCard={redCard}
            history={history}
            chips={chips}
            noBetPlayers={noBetPlayers}
            showRedCard={showRedCard}
            betResults={betResults}
          />
        ) : null}
      </div>
      <footer className='py-6 text-gray-400 text-xs sm:text-sm text-center'>
        &copy; {new Date().getFullYear()} DragonBlood Games.
      </footer>
    </div>
  );
}

export default App;
