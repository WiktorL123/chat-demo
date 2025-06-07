export default function Input({onChange}){
    return (
        <input style={
            {
                color: 'gray',
                width: '75%',
                borderRadius: '10px',
                backgroundColor: 'white',
            }}
        placeholder={'Enter a  message '}
               onChange={onChange}
        />
    )
}