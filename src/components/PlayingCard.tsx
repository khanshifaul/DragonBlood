import React from 'react';
import { motion } from 'framer-motion';

interface PlayingCardProps {
  value: string;
  suit: string;
  color: 'red' | 'black';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  reveal?: boolean;
  children?: React.ReactNode;
}

const suitSymbols: Record<string, string> = {
  '♥': 'text-red-600',
  '♦': 'text-red-600',
  '♣': 'text-black',
  '♠': 'text-black',
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  value,
  suit,

  selected = false,
  disabled = false,
  onClick,

  children,
}) => {
  return (
    <motion.button
      type="button"
      className={`relative flex flex-col items-center justify-center bg-white border rounded-lg shadow-md aspect-[3/4] w-14 sm:w-20 md:w-24 lg:w-28 p-0 overflow-hidden transition-all duration-150
        ${selected ? 'ring-2 ring-pink-400 border-pink-300 scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg hover:border-blue-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      animate={selected ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ perspective: 1000 }}
    >
      {/* Rainbow border effect for selected card */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `
              linear-gradient(
                45deg,
                #ff0000 0%,
                #ff9a00 10%,
                #d0de21 20%,
                #4fdc4a 30%,
                #3fdad8 40%,
                #2fc9e2 50%,
                #1c7fee 60%,
                #5f15f2 70%,
                #ba0cf8 80%,
                #fb07d9 90%,
                #ff0000 100%
              )
            `,
            padding: '2px',
            zIndex: 2,
            filter: 'blur(1px)'
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        />
      )}
      {/* Card corners */}
      <div className={`absolute top-1 left-1 text-xs sm:text-sm font-bold ${suitSymbols[suit]} select-none`}>
        <div>{value}</div>
        {/* <div className="text-xs">{suit}</div> */}
      </div>
      <div className={`absolute bottom-1 right-1 text-xs sm:text-sm font-bold ${suitSymbols[suit]} select-none rotate-180`}>
        <div>{value}</div>
        {/* <div className="text-xs">{suit}</div> */}
      </div>
      {/* Center suit pattern */}
      <div className="flex-1 flex items-center justify-center">
        <span className={`text-3xl ${suitSymbols[suit]} drop-shadow`}>{suit}</span>
      </div>
      {children}
    </motion.button>
  );
};

export default PlayingCard; 