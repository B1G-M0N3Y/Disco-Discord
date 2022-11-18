import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import { getServers } from "./store/servers";
import ServerProvider from "./context/ServerContext";
import ChannelsProvider from "./context/ChannelContext";
import MessageProvider from "./context/MessageContext";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
  window.getServers = getServers;
}

function Root() {
  return (
    <Provider store={store}>
      <ServerProvider>
        <ChannelsProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </ChannelsProvider>
      </ServerProvider>
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
