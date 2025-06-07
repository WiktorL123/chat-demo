import Input from "./Input.jsx";
import Send from "./Send.jsx";
import Message from "./Message.jsx";
import { useEffect, useRef, useState} from "react";

export default function Chat() {
    // const test = [
    //     {id:1, value: 'siema', sender: 'server', receiver:'client'},
    //     {id:2, value: 'JEBAC LEGIE', sender: 'server', receiver:'client'},
    //     {id:3, value: 'LEGIA TO FAJA', sender: 'server', receiver:'client'},
    //     {id:4, value: 'I LECHOWI LIZE JAJA', sender: 'client', receiver:'server'},
    //     {id:5, value: 'NAWROCKI', sender: 'client', receiver:'server'},
    //     {id:6, value: 'CO', sender: 'server', receiver:'klient'},
    //     {id:7, value: 'TY KURWO', sender: 'client', receiver:'server'},
    //     {id:8, value: 'DONALD MATOLE', sender: 'client', receiver:'server'},
    //     {id:9, value: 'TWOJ RZAD OBALA KIBOLE', sender: 'server', receiver:'client'},
    //     {id:10, value: 'DOSC POSMIEWISKA', sender: 'server', receiver:'client'},
    //     {id:11, value: 'WYPIERDALAJCIE Z BOISKA', sender: 'client', receiver:'server'},
    //     {id:12, value: 'W PUCHARACH SIE STARACIE', sender: 'client', receiver:'server'},
    //     {id:13, value: 'ZATO W LIDZE CHUJA GRACIE', sender: 'server', receiver:'client'},
    //
    // ];
const [messages, setMessages] = useState([]);
const [message, setMessage] = useState("");
const messageEnd = useRef(null);
const socketRef = useRef(null);

const sendMessage = (value) => {
    const message = {
        id: messages.length+1,
        value: value,
        sender: 'client',
        receiver: 'server',
        timestamp: Date.now(),
    }
    socketRef.current.send(JSON.stringify(message));
    setMessages(prev=>[...prev, message]);
    setMessage("");
}

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000')
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Socket opened");
        }
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prev=>[...prev, data]);
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
        <div style={{
            background: 'gray',
            width: '400px',
            height: '400px',
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
                        alignSelf: item.sender === 'server' ? 'flex-start' : 'flex-end',
                        backgroundColor: item.sender === 'server' ? '#eee' : '#dcf8c6',
                        borderRadius: '10px',
                        padding: '5px 10px',
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
                <Input onChange={(e)=>setMessage(e.target.value)}/>
                <Send onClick={()=>sendMessage(message)}/>
            </div>
        </div>

    )
}