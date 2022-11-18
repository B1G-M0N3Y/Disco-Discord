import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./store/session";
import ChatForm from "./components/Chat/ChatForm";
import LandingPage from "./components/LandingPage";
import ChannelMessagesPage from "./components/Channels/ChannelMessages";
import Servers from "./components/Servers";
import CreateServerForm from "./components/Servers/CreateServerFormModal/CreateServerForm";

function App() {
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());

      setLoaded(true);
    })();
  }, [dispatch]);

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
        <ProtectedRoute path="/servers/new" exact={true}>
          <CreateServerForm />
        </ProtectedRoute>
        <ProtectedRoute path="/chats" exact={true}>
          <ChatForm />
        </ProtectedRoute>
        <ProtectedRoute path="/servers" exact={true}>
          <Servers />
        </ProtectedRoute>
        <Route path="/" exact={true}>
          <LandingPage />
        </Route>
        <Route path="/channels/:channelId">
          <ChannelMessagesPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
