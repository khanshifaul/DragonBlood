import React, { useEffect, useState, useRef } from "react";
import CardSelector from "./CardSelector";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import confetti from "canvas-confetti";

interface BetFormProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  cardIndex: number;
  setCardIndex: (index: number) => void;
  onPlaceBet: () => void;
  disabled?: boolean;
  message?: string;
  selectionTime?: number; // seconds for countdown
  betPlaced?: boolean;
  revealCountdown?: number | null;
  showRedCard?: boolean;
  redCard?: number | null;
  roundId: string | number;
  minBet?: number;
  maxBet?: number;
  cardCount?: number;
  isWinner?: boolean;
}

const BetForm: React.FC<BetFormProps> = ({
  betAmount,
  setBetAmount,
  cardIndex,
  setCardIndex,
  onPlaceBet,
  disabled,
  message,
  selectionTime = 10,
  betPlaced,
  revealCountdown,
  showRedCard,
  redCard,
  roundId,
  minBet = 2,
  maxBet = 100,
  cardCount,
  isWinner = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(selectionTime);
  const isSelectionRequired = cardIndex === 0 && !disabled;

  // For animated progress bar color
  const progress = useMotionValue(1);
  const barColor = useTransform(
    progress,
    [1, 0.5, 0],
    ["#22c55e", "#fde047", "#ef4444"]
  ); // green -> yellow -> red
  const widthMotion = useTransform(progress, (p) => `${p * 100}%`);

  // Pulse state for round start
  const [pulse, setPulse] = useState(false);

  // For smooth, continuous countdown
  const rafRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);

  // Generate bet options based on minBet and maxBet
  const betOptions = [minBet, 5, 10, 15, 20, 25, 50, maxBet].filter(
    (v, i, arr) => v >= minBet && v <= maxBet && arr.indexOf(v) === i
  );

  // Card reveal animation variants
  const cardRevealVariants = {
    hidden: { 
      rotateY: 0, 
      scale: 0.8,
      opacity: 0,
      boxShadow: "0 0 0px rgba(0,0,0,0)"
    },
    winner: {
      rotateY: 720,
      scale: 1.2,
      opacity: 1,
      boxShadow: "0 0 60px 30px rgba(255, 215, 0, 0.6)",
      transition: {
        duration: 1.5
      }
    },
    loser: {
      rotateY: 360,
      scale: 1,
      opacity: 1,
      boxShadow: "0 0 0px rgba(0,0,0,0)",
      transition: {
        duration: 1
      }
    }
  };

  // Confetti effects
  const fireConfetti = () => {
    const count = 300;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
      spread: 100,
    };

    // Base confetti
    confetti({
      ...defaults,
      particleCount: count,
      scalar: 0.8,
      colors: ['#FFD700', '#FF0000', '#FFFFFF'],
      shapes: ['square', 'circle', 'star'] as any
    });

    // Larger particles
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.3),
      scalar: 1.2,
      shapes: ['circle', 'star'] as any,
    });

    // Giant stars
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.1),
      scalar: 2,
      shapes: ['star'] as any,
      colors: ['#FFD700']
    });

    // Rising confetti
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.5),
      angle: 90,
      spread: 60,
      startVelocity: 45,
      decay: 0.9,
      shapes: ['square', 'circle', 'star'] as any
    });
  };

  // Loser animation (smoke effect)
  const fireLoserEffect = () => {
    const count = 100;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
      spread: 50,
      colors: ['#555555', '#888888', '#BBBBBB'],
      scalar: 1.2,
      shapes: ['circle'] as any
    };

    confetti({
      ...defaults,
      particleCount: count,
      startVelocity: 30,
      decay: 0.85
    });
  };

  useEffect(() => {
    if (disabled) return;
    // Animate progress bar refill
    animate(progress, 1, { duration: 0.4, ease: 'easeOut' });
    setTimeLeft(selectionTime);
    setPulse(true); // trigger pulse
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    endTimeRef.current = Date.now() + selectionTime * 1000;
    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, (endTimeRef.current - now) / 1000);
      setTimeLeft(left);
      progress.set(left / selectionTime);
      if (left > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeLeft(0);
        progress.set(0);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    // Remove pulse after short delay
    const pulseTimeout = setTimeout(() => setPulse(false), 600);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(pulseTimeout);
    };
  }, [disabled, selectionTime, progress, roundId]);

  useEffect(() => {
    if (Math.floor(timeLeft) === 0 && !disabled && !betPlaced) {
      onPlaceBet();
    }
  }, [timeLeft, disabled, onPlaceBet, betPlaced]);

  useEffect(() => {
    if (showRedCard && redCard !== null) {
      if (isWinner) {
        fireConfetti();
      } else {
        fireLoserEffect();
      }
    }
  }, [showRedCard, redCard, isWinner]);

  // Auto-select the last card at the start of each round, but don't place bet
  useEffect(() => {
    if (!disabled && cardIndex === 0 && typeof cardCount === "number") {
      setCardIndex(cardCount);
    }
    // Only run on roundId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId, cardCount]);

  return (
    <div className="w-full">
      <div className="relative flex flex-col gap-4 p-4 sm:p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg w-full border border-gray-700">
        {/* Overlay for reveal/result phase */}
        {typeof revealCountdown === "number" && revealCountdown >= 0 && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 rounded-2xl animate-fade-in backdrop-blur-sm">
            <span className="text-3xl sm:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Revealing in...
            </span>
            <motion.span
              className="text-6xl sm:text-7xl font-extrabold text-yellow-300 drop-shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                textShadow: ["0 0 10px rgba(255,215,0,0)", "0 0 20px rgba(255,215,0,0.8)", "0 0 10px rgba(255,215,0,0)"]
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut"
              }}
            >
              {revealCountdown}
            </motion.span>
          </div>
        )}
        
        {showRedCard && redCard !== null && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 rounded-2xl animate-fade-in backdrop-blur-sm">
            {betPlaced === false ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-36 sm:w-32 sm:h-48 bg-gradient-to-br from-gray-500 to-gray-700 border-4 border-gray-400 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <span className="text-5xl sm:text-7xl font-extrabold text-gray-300 drop-shadow-lg">
                    {redCard}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent ${
                    isWinner 
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                      : "bg-gradient-to-r from-gray-300 to-gray-500"
                  }`}
                >
                  {isWinner ? "You Won!" : "You Lost"}
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  animate={isWinner ? "winner" : "loser"}
                  variants={cardRevealVariants}
                  className="flex items-center justify-center"
                  style={{ perspective: 1000 }}
                >
                  <div className={`w-24 h-36 sm:w-32 sm:h-48 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden ${
                    isWinner 
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-700 border-4 border-yellow-300"
                      : "bg-gradient-to-br from-gray-600 to-gray-800 border-4 border-gray-400"
                  }`}>
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: isWinner ? 0.8 : 0.5,
                        duration: 0.6,
                        type: "spring",
                        bounce: 0.5,
                      }}
                      className={`text-5xl sm:text-7xl font-extrabold drop-shadow-lg ${
                        isWinner ? "text-yellow-100" : "text-gray-300"
                      }`}
                    >
                      {redCard}
                    </motion.span>
                    
                    {/* Winner sparkles */}
                    {isWinner && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-yellow-300"
                            initial={{ 
                              opacity: 0,
                              scale: 0,
                              x: Math.cos((i * 45 * Math.PI) / 180) * 10,
                              y: Math.sin((i * 45 * Math.PI) / 180) * 10
                            }}
                            animate={{ 
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                              x: Math.cos((i * 45 * Math.PI) / 180) * 50,
                              y: Math.sin((i * 45 * Math.PI) / 180) * 50
                            }}
                            transition={{
                              delay: 1 + i * 0.1,
                              duration: 1.5,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className={`mt-6 text-lg font-medium ${
                    isWinner ? "text-yellow-200" : "text-gray-400"
                  }`}
                >
                  {isWinner 
                    ? "Congratulations! Your bet paid off!"
                    : "Better luck next round!"}
                </motion.div>
              </>
            )}
          </div>
        )}
        
        {/* {disabled && !revealCountdown && !showRedCard && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 rounded-2xl animate-fade-in backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Revealing Results...
            </span>
            <span className="text-white/80 text-lg">
              Please wait for the next round
            </span>
          </div>
        )} */}

        <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Place Your Bet
        </h2>
        
        <div
          className={`w-full p-4 rounded-xl ${
            isSelectionRequired
              ? "bg-yellow-500/10 ring-2 ring-yellow-400 animate-pulse"
              : "bg-gray-700/50"
          }`}
        >
          
            <CardSelector
              cardCount={cardCount as number}
              selectedIndex={cardIndex}
              onSelect={setCardIndex}
              disabled={disabled}
            />
      
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col items-center w-full">
            <label className="text-white/80 text-sm mb-2 uppercase tracking-wider">
              Bet Amount
            </label>
            <div className="grid grid-cols-4 gap-2 w-full">
              {betOptions.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => setBetAmount(option)}
                  className={`px-3 py-2 rounded-lg font-bold border transition-all text-sm sm:text-base
                    ${
                      betAmount === option
                        ? "bg-gradient-to-br from-green-500 to-blue-600 text-white border-transparent scale-105 shadow-lg"
                        : "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    }
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  disabled={disabled}
                  whileHover={!disabled ? { scale: 1.05 } : {}}
                  whileTap={!disabled ? { scale: 0.95 } : {}}
                >
                  {option}x
                </motion.button>
              ))}
            </div>
          </div>

          <button
            onClick={onPlaceBet}
            className={`w-full py-3 rounded-xl shadow-lg transition-all text-base sm:text-lg font-bold mt-2
              ${
                disabled || betPlaced || cardIndex === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white cursor-pointer"
              }`}
            disabled={betPlaced || cardIndex === 0}
            title="Place your bet"
          >
            {betPlaced ? (
              <span className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bet Placed
              </span>
            ) : (
              "Place Bet"
            )}
          </button>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-sm text-white/80">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Time left
              </span>
              <motion.span
                className={`font-bold ${timeLeft <= 3 ? "text-red-400" : "text-yellow-300"}`}
                animate={{
                  scale: pulse
                    ? [1, 1.25, 1]
                    : timeLeft <= 3
                      ? [1, 1.15, 1]
                      : 1,
                  color:
                    timeLeft <= 3
                      ? ["#fff", "#ef4444", "#fff"]
                      : undefined,
                  textShadow: pulse
                    ? "0 0 12px #fde047, 0 0 24px #fde047"
                    : undefined,
                }}
                transition={{
                  duration: pulse ? 0.6 : 0.8,
                  repeat: pulse ? 0 : timeLeft <= 3 ? Infinity : 0,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block", minWidth: 32 }}
                aria-live="polite"
              >
                {Math.ceil(timeLeft)}s
              </motion.span>
            </div>
            <motion.div
              className="h-2.5 rounded-full"
              style={{ width: widthMotion, background: barColor }}
              animate={pulse ? { boxShadow: "0 0 16px 4px #fde047" } : { boxShadow: "none" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {message && (
            <div className="text-red-400 text-sm text-center mt-2 animate-pulse flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetForm;