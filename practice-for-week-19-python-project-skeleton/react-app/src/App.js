import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import ServerMembers from "./components/ServerMembers";
import UpdateServer from "./components/Servers/UpdateServer";
import ChatMembers from "./components/Chat/ChatMembers";
import { getChat } from "./store/chat";

function App() {
  const [loaded, setLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      await dispatch(getChat());

      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <div className={!user?.id ? "logged-out-landing" : "left-right-columns"}>
        <NavBar />
      </div>
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
        <ProtectedRoute path="/chats/:chatId">
          <ChatForm />
        </ProtectedRoute>
        <ProtectedRoute path="/servers/:serverId/edit" exact={true}>
          <UpdateServer />
        </ProtectedRoute>
        <ProtectedRoute path="/servers/:serverId" exact={true}>
          <Servers />
        </ProtectedRoute>
        <ProtectedRoute
          path="/servers/:serverId/channels/:channelId"
          exact={true}
        >
          <ChannelMessagesPage />
        </ProtectedRoute>
        <Route path="/" exact={true}>
          <LandingPage />
        </Route>
      </Switch>
      <Route path="/servers/:serverId">
        <ServerMembers />
      </Route>
      <Route path="/chats/:chatId">
        <ChatMembers />
      </Route>
    </BrowserRouter>
  );
}

export default App;
