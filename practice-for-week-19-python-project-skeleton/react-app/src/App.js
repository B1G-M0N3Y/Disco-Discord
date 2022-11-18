import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import Chat from "./components/Chat";
import { authenticate } from "./store/session";
import BasicChat from "./components/Chat/BasicChat";
import { io } from "socket.io-client";
import ChatForm from "./components/Chat/ChatForm";
import LandingPage from "./components/LandingPage";
// import UpdateServer from "./components/Servers/UpdateServer";
import ChannelMessagesPage from "./components/Channels/ChannelMessages";
// import SidebarNav from "./components/SidebarNav";
import ChannelList from "./components/Channels/ChannelList";
import Servers from "./components/Servers";

function App() {
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());

      setLoaded(true);
    })();
  }, [dispatch]);

  // useEffect(() =>{
  //   if(sessionUser) {
  //     const socket = io("localhost:5000", {
  //       transports : ["websocket"],
  //       cors: {
  //         authenticate
  //       }
  //     });

  //     setSocketInstance(socket);

  //     socket.on("connect", (data)=> {
  //       console.log(data);
  //     })

  //     setLoaded(false);

  //     socket.on("disconnect", (data) => {
  //       console.log(data);
  //     })

  //     return function cleanup() {
  //       socket.disconnect();
  //     }
  //   }
  // },[sessionUser])

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path="/chat" exact={true}>
          <Chat />
        </ProtectedRoute>
        <ProtectedRoute path="/servers" exact={true}>
          <Servers />
        </ProtectedRoute>

        <Route path="/" exact={true}>
          <LandingPage />
          {/* <SidebarNav /> */}
        </Route>
        {/* <Route path="/chat">
          {loaded && <BasicChat />}
        </Route> */}
        <Route path="/channels/:channelId">
          <ChannelMessagesPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
