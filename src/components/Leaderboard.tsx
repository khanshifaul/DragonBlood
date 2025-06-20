import React from 'react';
import type { Player } from '../types/game';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayerId }) => {
  const sorted = [...players].sort((a, b) => b.chips - a.chips);
  
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
        Leaderboard
      </h3>
      
      <div className="space-y-3">
        {sorted.map((player, index) => (
          <div 
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.id === currentPlayerId 
                ? 'bg-blue-900/30 border border-blue-700/50' 
                : 'bg-gray-700/30 hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                index === 0 ? 'bg-yellow-500 text-black' : 
                index === 1 ? 'bg-gray-400 text-black' : 
                index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-600 text-white'
              }`}>
                {index + 1}
              </div>
              <span className={`font-medium ${
                player.id === currentPlayerId ? 'text-blue-300' : 'text-white'
              }`}>
                {player.name}
              </span>
            </div>
            <span className="font-bold text-yellow-300">{player.chips}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;