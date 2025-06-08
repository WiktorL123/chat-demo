export default function Input({value, onChange, onEnter}){
    return (
        <input style={
            {
                color: 'gray',
                width: '75%',
                borderRadius: '10px',
                backgroundColor: 'white',
            }}
               value={value}
               placeholder={'Enter a  message '}
               onChange={onChange}
               onKeyDown={(e) =>{
                   if(e.key === 'Enter') onEnter()
               }}
        />
    )
}