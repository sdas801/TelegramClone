import { io } from 'socket.io-client';

let socket;
let connectionPromise;
export const initSocket = () => {
  if (socket?.connected) {
    return Promise.resolve(socket);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise((resolve, reject) => {
    if (!socket) {
      socket = io("https://dev.myhygge.io", {
        path: "/hygmsocket",              // ✅ Add this - matches Kotlin config
        transports: ['websocket'],        // Force WebSocket (like Kotlin)
        reconnection: true,               // Matches Kotlin
        reconnectionAttempts: 50,         // Matches Kotlin
        reconnectionDelay: 2000,          // Matches Kotlin (2000ms)
        timeout: 50000,                   // Matches Kotlin (50000ms)
        autoConnect: true,
        forceNew: true,
      });

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        resolve(socket);
        connectionPromise = null;
      });

      socket.on("connect_error", (error) => {
        console.log("Connection failed:", error.message);
        console.log("Connection failed:", error);
        console.log("Error type:", error.type);
        console.log("Error description:", error.description);
        reject(error);
        connectionPromise = null;
      });

      socket.on("reconnect_attempt", (attempt) => {
        console.log(`Trying to reconnect... (attempt ${attempt})`);
      });

      socket.on("reconnect_failed", () => {
        console.log("Reconnection failed after several tries");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Add connection timeout
      setTimeout(() => {
        if (!socket.connected) {
          reject(new Error("Connection timeout"));
          connectionPromise = null;
        }
      }, 10000);
    } else {
      resolve(socket);
      connectionPromise = null;
    }
  });

  return connectionPromise;
}
export const getSocket = () => socket;





