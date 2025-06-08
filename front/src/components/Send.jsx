export default function Send({onClick, disabled}){
    return (
        <div style={{paddingLeft: '4px', paddingRight: '4px'}}>
            <button onClick={onClick} disabled={disabled}>Send</button>

        </div>

    )
}