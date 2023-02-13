import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import { getServerMembers, getServers } from "./store/servers";
import { ModalProvider } from "./context/Modal";
import ServerProvider from "./context/ServerContext";
import ChannelsProvider from "./context/ChannelContext";
import ChatProvider from "./context/ChatContext";
import MessageProvider from "./context/MessageContext";
import { getCurrentChannels } from "./store/channels";
import { addServerMember } from "./store/users";
import SocketProvider from "./context/SocketContext";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
  window.getServers = getServers;
  window.getCurrentChannels = getCurrentChannels;
  window.addServerMember = addServerMember;
}

function Root() {
  return (
    <Provider store={store}>
      <SocketProvider>
      <ModalProvider>
        <ServerProvider>
          <ChannelsProvider>
            <MessageProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </MessageProvider>
          </ChannelsProvider>
        </ServerProvider>
      </ModalProvider>
      </SocketProvider>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//         <App />
//       </Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
