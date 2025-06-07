
import './App.css'
import Chat from "./components/Chat.jsx";

function App() {


  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h1>Chat Simulation</h1>
        <div>
            <Chat/>
        </div>
    </div>
  )
}

export default App
