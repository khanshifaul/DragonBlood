import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Player, GameState } from '../types/game';

export function useSocket(
  apiBaseUrl: string,
  handlers: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onGameState?: (state: GameState) => void;
    onPlayerJoined?: (player: Player) => void;
    onRoundStarted?: (state: GameState) => void;
    onRoundCompleted?: (data: { gameState: GameState; winners: string[]; redCardPosition: number }) => void;
    onBetFailed?: (data: { message: string }) => void;
    onConnectError?: (err: Error) => void;
  }
) {
  useEffect(() => {
    const socket: Socket = io(apiBaseUrl);
    if (handlers.onConnect) socket.on('connect', handlers.onConnect);
    if (handlers.onDisconnect) socket.on('disconnect', handlers.onDisconnect);
    if (handlers.onGameState) socket.on('gameState', handlers.onGameState);
    if (handlers.onPlayerJoined) socket.on('playerJoined', handlers.onPlayerJoined);
    if (handlers.onRoundStarted) socket.on('roundStarted', handlers.onRoundStarted);
    if (handlers.onRoundCompleted) socket.on('roundCompleted', handlers.onRoundCompleted);
    if (handlers.onBetFailed) socket.on('betFailed', handlers.onBetFailed);
    if (handlers.onConnectError) socket.on('connect_error', handlers.onConnectError);
    return () => {
      socket.disconnect();
    };
  }, [apiBaseUrl]);
} 