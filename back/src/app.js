import path from 'path'
import {fileURLToPath } from 'url'
import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import Message from "./Message.js";
import {randomUUID} from 'crypto';
import ChatSession from "./ChatSession.js";
export const app = express();
export const server = http.createServer(app);
const messagesSocket = new WebSocketServer({server});
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientPath = path.join(__dirname, '../../front/dist'); // ścieżka do frontu

app.use(express.static(clientPath));

app.get('/*', (req, res) => {
   res.sendFile(path.join(clientPath, 'index.html'));
});
const sockets = new Map()
const pairs = new Map()
const sessions = new Map()
let waitingUser = null

messagesSocket.on('connection', async (socket) => {


   const userId = randomUUID()
   console.log(` ${userId} connected!`);
   sockets.set(userId, socket)
   socket.send(JSON.stringify({
      type: 'init',
      userId
   }))

   if (!waitingUser) {
      waitingUser = userId

      socket.send(JSON.stringify({
         type: 'waiting',
         message: 'Oczekiwanie na połączenie...'
      }))
   }
   else {
      const userA = waitingUser
      const userB = userId
      waitingUser = null

      const socketA = sockets.get(userA)
      const socketB = sockets.get(userB)

      const session = await ChatSession.create({
         participants: [
             userA,
             userB,
         ]
      })

      pairs.set(userA, userB)
      pairs.set(userB, userA)

      sessions.set(userA, session._id)
      sessions.set(userB, session._id)


      socketA?.send(JSON.stringify({
         type: 'paired',
         partnerId: userB,
         sessionId: session._id
      }))

      socketB?.send(JSON.stringify({
         type: 'paired',
         partnerId: userA,
         sessionId: session._id,
      }))

   }

   socket.on('message', async (message) => {
      try {
         const parsed = JSON.parse(message);
         const partnerId = pairs.get(userId);
         const partnerSocket = sockets.get(partnerId);
         const sessionId = sessions.get(userId);

         if (!partnerId || !sessionId) return;

         const fullMessage = {
            value: parsed.value,
            sender: userId,
            receiver: partnerId,
            sessionId,
            timestamp: new Date(),
         };

         const saved = await Message.create(fullMessage);

         // wyślij do partnera
         partnerSocket?.send(JSON.stringify({
            type: 'message',
            message: {
               ...fullMessage,
               id: saved._id,
            }
         }));


      } catch (err) {
         console.error('Failed to handle message:', err);
      }
   });



   socket.on('close', async () => {
      console.log(`client ${userId} disconnected`);

      sockets.delete(userId);

      if (waitingUser === userId) {
         waitingUser = null;
         return;
      }

      const partnerId = pairs.get(userId);
      const sessionId = sessions.get(userId);

      if (partnerId) {
         const partnerSocket = sockets.get(partnerId);

         partnerSocket?.send(JSON.stringify({
            type: 'partner_disconnected',
            message: 'Drugi użytkownik opuścił czat. Oczekiwanie na nową parę...'
         }));

         pairs.delete(userId);
         pairs.delete(partnerId);
         sessions.delete(userId);
         sessions.delete(partnerId);

         waitingUser = partnerId;
      }

      if (sessionId) {
         await ChatSession.findByIdAndUpdate(sessionId, { closedAt: new Date() });
      }
   });

})




