import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
  server: string;
  connectionError: string;
  onReconnect: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ connected, server, connectionError, onReconnect }) => (
  <div className="mb-2 text-xs text-gray-300 flex justify-between">
    <span>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</span>
    <span>Server: {server}</span>
    {!connected && (
      <button onClick={onReconnect} className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded text-xs">Reconnect</button>
    )}
    {connectionError && <div className="text-red-500 text-sm mb-2">{connectionError}</div>}
  </div>
);

export default ConnectionStatus; 