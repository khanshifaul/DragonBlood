import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import PlayingCard from './PlayingCard';

interface CardSelectorProps {
  cardCount: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
  revealedIndex?: number;
}

const suits = ['♥', '♦', '♣', '♠'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const CardSelector: React.FC<CardSelectorProps> = ({ 
  cardCount, 
  selectedIndex, 
  onSelect, 
  disabled, 
   
}) => {
  // Generate cards with suits and values
  const getCardDetails = (index: number) => {
    const suitIndex = index % suits.length;
    const valueIndex = index % values.length;
    return {
      suit: suits[suitIndex],
      value: values[valueIndex],
      color: suitIndex < 2 ? 'red' : 'black',
    };
  };

  // Reveal animation can be handled in PlayingCard in the future if needed

  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2">
      {Array.from({ length: cardCount }, (_, i) => {
        const { suit, value, color } = getCardDetails(i);
        return (
          <PlayingCard
            key={i}
            value={value}
            suit={suit}
            color={color as 'red' | 'black'}
            selected={selectedIndex === i + 1}
            disabled={disabled}
            onClick={() => !disabled && onSelect(i + 1)}
          >
            {/* Selection star */}
            {selectedIndex === i + 1 && (
              <motion.div
                className="absolute top-1 right-1 text-yellow-400 drop-shadow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ zIndex: 3 }}
              >
                <FaStar size={10} />
              </motion.div>
            )}
          </PlayingCard>
        );
      })}
    </div>
  );
};

export default CardSelector;