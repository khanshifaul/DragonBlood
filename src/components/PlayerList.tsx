import React from 'react';
import type { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => (
  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 shadow-lg border border-gray-700">
    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
      Players ({players.length})
    </h3>
    
    <div className="space-y-3">
      {players.map(player => (
        <div 
          key={player.id}
          className={`p-3 rounded-lg flex justify-between items-center ${
            player.id === currentPlayerId 
              ? 'bg-blue-900/30 border border-blue-700/50' 
              : 'bg-gray-700/30 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 text-white">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <span className={`font-medium ${
              player.id === currentPlayerId ? 'text-blue-300' : 'text-white'
            }`}>
              {player.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {player.currentBet && (
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-1">Bet:</span>
                <span className="text-yellow-300 font-medium">{player.currentBet.amount}</span>
                <span className="text-xs text-gray-400 mx-1">on</span>
                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                  {player.currentBet.cardIndex}
                </div>
              </div>
            )}
            <span className="font-bold text-yellow-300">{player.chips}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PlayerList;