const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // Permite que el frontend en Vite se conecte
    // Añade más orígenes si subes el frontend
    // origin: ["http://localhost:5173", "https://chat-api-ia35.onrender.com"], 
    origin: ["http://localhost:5173", "https://dapper-pavlova-e4f8ab.netlify.app"], 
    methods: ["GET", "POST"],
  },
});
// Para peticiones HTTP, aunque Socket.IO usa su propia configuración CORS
app.use(cors()); 

// Ruta básica para probar el servidor
app.get("/", (req, res) => {
  res.send("¡Servidor de chat funcionando!");
});

// Manejo de eventos WebSocket
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Escucha mensajes del cliente
  socket.on("message", (msg) => {
    console.log("Mensaje recibido:", msg);
    // Hora actual en formato HH:MM:SS
    const timestamp = new Date().toLocaleTimeString();
    // Envía el mensaje con el ID del remitente a todos los clientes conectados
    io.emit("message", { text: msg, senderId: socket.id, timestamp}); 
  });

  // Detecta desconexión
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Inicia el servidor
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});