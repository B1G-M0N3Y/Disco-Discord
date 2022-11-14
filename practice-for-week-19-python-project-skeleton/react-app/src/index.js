import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import {
  getServerMembers,
  getServerChannels,
  getServers,
} from "./store/servers";
import ServerProvider from "./context/ServerContext";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
  window.getServers = getServers;
  window.getServerMembers = getServerMembers;
  window.getServerChannels = getServerChannels;
}

function Root() {
  return (
    <Provider store={store}>
      <ServerProvider>
        <App />
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
