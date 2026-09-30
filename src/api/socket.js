import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const socket = io(baseURL, { autoConnect: false });

export default socket;