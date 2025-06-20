import React from 'react';
import type { RoundHistory } from '../types/game';

interface GameHistoryProps {
  history: RoundHistory[];
  noBetPlayers?: string[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history, }) => (
  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 shadow-lg border border-gray-700">
    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
      Recent Rounds
    </h3>
    
    {history.length === 0 ? (
      <div className="text-center py-6 text-gray-400">
        No rounds played yet
      </div>
    ) : (
      <div className="space-y-4">
        {history.slice(0, 5).map((round, index) => (
          <div key={index} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-blue-300">Round #{round.round}</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">Card:</span>
                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                  {round.redCard}
                </div>
              </div>
            </div>
            
            {round.winners.length > 0 ? (
              <div className="mb-2">
                <div className="text-xs text-green-400 mb-1">Winners</div>
                <div className="flex flex-wrap gap-2">
                  {round.winners.map((winner, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-green-600/20 rounded text-green-300 text-xs"
                    >
                      {winner}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 mb-2">No winners</div>
            )}
            
            {round.noBetPlayers && round.noBetPlayers.length > 0 && (
              <div>
                <div className="text-xs text-red-400 mb-1">No Bet</div>
                <div className="flex flex-wrap gap-2">
                  {round.noBetPlayers.map((player, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-red-600/20 rounded text-red-300 text-xs"
                    >
                      {player}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default GameHistory;