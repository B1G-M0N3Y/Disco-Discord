import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSelectedChannels } from "../../context/ChannelContext"
import { getPrivateChats } from "../../store/private_messages"

const PrivateMessages = () => {
    const dispatch = useDispatch()
    // const [chats, setChats] = useState([])
    const chats = useSelector((state) => {
        return state.privateMessages.chats
    })

    const selectChat = () =>{
        
    }

    useEffect(() => {
        dispatch(getPrivateChats())
    }, [dispatch])

    return(
    <div>
        {Object.values(chats).map(chat => (
            <p onClick={selectChat(chat.id)}>{chat.name}</p>
        ))}
    </div>
    )

}

export default PrivateMessages
