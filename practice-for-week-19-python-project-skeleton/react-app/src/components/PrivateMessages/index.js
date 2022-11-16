import { useState } from "react"
import { useDispatch } from "react-redux"

const PrivateMessages = () => {
    const dispatch = useDispatch()
    const [chats, setChats] = useState([])

    return(
    <div>
        CHATS HERE
    </div>
    )

}

export default PrivateMessages
