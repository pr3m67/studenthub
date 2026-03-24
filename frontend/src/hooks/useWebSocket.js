import { useEffect, useRef } from "react";

export function useWebSocket({ enabled, onMessage }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const url = import.meta.env.VITE_WS_URL || "ws://localhost/ws/notices/";
    socketRef.current = new WebSocket(url);
    socketRef.current.onmessage = (event) => {
      try {
        onMessage?.(JSON.parse(event.data));
      } catch {
        onMessage?.(event.data);
      }
    };
    return () => socketRef.current?.close();
  }, [enabled, onMessage]);

  return socketRef;
}
