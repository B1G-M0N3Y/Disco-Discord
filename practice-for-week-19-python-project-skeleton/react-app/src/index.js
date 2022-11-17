import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import { getServerMembers, getServers } from "./store/servers";
import { ModalProvider } from "./context/Modal"
import ServerProvider from "./context/ServerContext";
import ChannelsProvider from "./context/ChannelContext";
import ChatProvider from "./context/ChatContext";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
  window.getServers = getServers;
  window.getServerMembers = getServerMembers;
}

function Root() {
  return (
    <Provider store={store}>
      <ModalProvider>
      <ServerProvider>
        <ChannelsProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
          </ChannelsProvider>
        </ServerProvider>
      </ModalProvider>
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
