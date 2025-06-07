import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import Message from "./Message.js";
export const app = express();
export const server = http.createServer(app);
const messagesSocket = new WebSocketServer({server});
app.use(express.json());

messagesSocket.on('connection', (socket) => {
   console.log('connected!');

   socket.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
      await Message.create(parsedMessage);
   });

   const interval = setInterval(async () => {
      const reply = {
         value: `nowa wiadomosc ${new Date().toLocaleDateString()}`,
         sender: 'server',
         receiver: 'client',
      };
      console.log(reply);
      try {
         const savedReply = await Message.create(reply);
         socket.send(JSON.stringify({
            ...reply,
            id: savedReply._id,
         }));
      } catch (error) {
         console.error(error);
      }
   }, 10000);

   socket.on('close', () => {
      clearInterval(interval);
      console.log('client disconnected');
   });
});




app.get('/', (req, res) => {
   return  res.send('index');
})