import Input from "./Input.jsx";
import Send from "./Send.jsx";
import Message from "./Message.jsx";
import { useEffect, useRef, useState} from "react";

export default function Chat() {


const [myUserId, setMyUserId] = useState(null);
const [partnerId, setPartnerId] = useState(null);
const [sessionId, setSessionId] = useState(null);
const [isPaired, setIsPaired] = useState(false);
const [waitingMessage, setWaitingMessage] = useState(false);
const [messages, setMessages] = useState([]);
const [message, setMessage] = useState("");
const messageEnd = useRef(null);
const socketRef = useRef(null);

const sendMessage = (value) => {
    if (!isPaired || !myUserId || !partnerId) return
    const message = {

        value: value,
        sender: myUserId,
        receiver: partnerId,
        timestamp: Date.now(),
    }
    socketRef.current.send(JSON.stringify(message));
    setMessages(prev=>[...prev, message]);
    setMessage("");
}

    useEffect(() => {
        const socket = new WebSocket(window.location.origin.replace(/^http/, 'ws'))

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Socket opened");
        }
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            switch (data.type) {
                case 'init':
                    setMyUserId(data.userId);
                    break;
                case 'waiting':
                    setIsPaired(false);
                    setWaitingMessage(data.message);
                    break;
                case 'paired':
                    setIsPaired(true);
                    setPartnerId(data.partnerId);
                    setSessionId(data.sessionId);
                    setWaitingMessage(null);
                    break
                case 'message':
                    setMessages(prev=>[...prev, data.message]);
                    break;
                case 'partner_disconnected':
                    setIsPaired(false);
                    setWaitingMessage(data.message);
                    setPartnerId(null)
                    setSessionId(null)
                    break
                default:
                    break;
            }
        }

        socket.onclose = () => {
            console.log("Socket closed");
        }
      return () => {
            socket.close();
      }
    }, []);
    useEffect(() => {
        messageEnd.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages])

    return (
        <>
        {!isPaired &&(
            <div>
                {waitingMessage || 'waiting...'}
            </div>
    )}

            {sessionId && (
                <div>sesja: {sessionId}</div>
            )}
            {myUserId && (
                <div>ID: {myUserId}</div>
            )}

        <div style={{
            background: 'gray',
            width: '250px',
            height: '250px',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                flexGrow: 1,
            }}
            >
            {messages.map((item) => (
                <div
                    key={item.id}
                    style={{
                        alignSelf: item.sender === myUserId ? 'flex-end' : 'flex-start',
                        backgroundColor: item.sender === myUserId ? '#dcf8c6' : '#eee',
                        borderRadius: '10px',
                        padding: '0.5rem 1rem',
                        margin: '4px 0',
                        maxWidth: '70%',
                        color: 'gray'
                    }}
                >
                    <Message message={item} />
                </div>
            ))}
            <div ref={messageEnd}></div>
            </div>
            <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Input
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onEnter={()=>sendMessage(message)}
                />
                <Send onClick={()=>sendMessage(message)} disabled={!message.trim()}/>
            </div>
        </div>
        </>
    )
}