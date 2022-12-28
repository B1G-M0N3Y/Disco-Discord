import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addMessage, getChannelMessages } from "../store/channel_messages";
import { getChat } from "../store/chat";

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  let socket = io();

  useEffect(() => {


    socket.on("connect", () => {
      console.log("***CONNECTED TO WEB SOCKET");
    });

    socket.on("newmessage", (data) => {
      console.log(data, typeof data, "INCOMING MESSAGE****");
      // dispatch(addChatMessage(data));
      dispatch(getChat());
    });
    socket.on("updatechats", (data) => {
      console.log("NEW CHAT ALERT****");
      // dispatch(addChatMessage(data));
      dispatch(getChat());
    });

    socket.on("channelmessage", (message) => {
      dispatch(addMessage(message));
      dispatch(getChannelMessages(message["channel_id"]));
    });

    socket.on("initialize", (data) => {
      console.log("initialized data", data);
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
