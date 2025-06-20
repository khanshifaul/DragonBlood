import React from 'react';

interface GameStatePanelProps {
  round: number;
  pot: number;
  redCard?: number | null;
  winners: string[];
}

const GameStatePanel: React.FC<GameStatePanelProps> = ({ round, pot, redCard, winners }) => (
  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 shadow-lg border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Game Status
      </h3>
      <div className="px-3 py-1 bg-blue-600/30 rounded-full text-blue-300 text-sm font-medium">
        Round #{round}
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
        <span className="text-gray-300">Total Pot</span>
        <span className="text-2xl font-bold text-yellow-400">{pot}</span>
      </div>

      {redCard && (
        <div className="flex justify-between items-center p-3 bg-red-900/30 rounded-lg border border-red-800/50">
          <span className="text-gray-300">Winning Card</span>
          <span className="text-2xl font-bold text-red-400">{redCard}</span>
        </div>
      )}

      {winners.length > 0 && (
        <div className="p-3 bg-green-900/20 rounded-lg border border-green-800/50">
          <div className="text-sm text-green-300 mb-1">Winners</div>
          <div className="flex flex-wrap gap-2">
            {winners.map((winner, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-green-600/30 rounded-full text-green-300 text-sm font-medium"
              >
                {winner}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default GameStatePanel;