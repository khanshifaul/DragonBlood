import React, { useRef } from 'react';
import ConnectionStatus from '../components/ConnectionStatus';

interface HomePageProps {
  name: string;
  setName: (name: string) => void;
  joining: boolean;
  joinGame: () => void;
  message: string;
  connected: boolean;
  server: string;
  connectionError: string;
  onReconnect: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  name,
  setName,
  joining,
  joinGame,
  message,
  connected,
  server,
  connectionError,
  onReconnect
}) => {
  const joinInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-full max-w-md  bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Card Game</h1>
          <p className="text-blue-100 mt-2">Join the exciting card game adventure</p>
        </div>

        {/* Connection Status */}
        <div className="px-6 pt-4">
          <ConnectionStatus 
            connected={connected} 
            server={server} 
            connectionError={connectionError} 
            onReconnect={onReconnect} 
          />
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="player-name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              ref={joinInputRef}
              id="player-name"
              type="text"
              value={name}
              maxLength={10}
              onChange={e => setName(e.target.value.slice(0, 10))}
              placeholder="Enter your nickname"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                message || (name.length > 0 && name.length < 2) ? 'border-red-500' : 'border-gray-600'
              } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              disabled={joining}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && !joining && name.trim().length >= 2) {
                  joinGame();
                }
              }}
            />
            {name.length > 0 && name.length < 2 && (
              <div className="text-red-400 text-xs mt-1">Name must be at least 2 characters</div>
            )}
            <div className="text-gray-400 text-xs mt-1 text-right">{name.length}/10</div>
          </div>

          <button
            onClick={joinGame}
            disabled={joining || name.trim().length < 2}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all cursor-pointer ${
              joining 
                ? 'bg-blue-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/20'
            } flex items-center justify-center`}
          >
            {joining ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </>
            ) : (
              'Join Game'
            )}
          </button>

          {message && (
            <div className="p-3 bg-red-900/30 rounded-lg border border-red-800/50 text-red-300 text-sm flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-900/50 text-center">
          <p className="text-gray-400 text-sm">
            Ready to play? Enter your name and join the game!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;