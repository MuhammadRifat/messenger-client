import './App.css';
import Header from './components/Header/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Friend from './components/Friends/Friends';
import Chats from './components/Chats/Chats';
import AddFriends from './components/AddFriends/AddFriends';
import NotFound from './components/NotFound/NotFound';
import { createContext, useContext, useState } from 'react';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './components/Login/Login';
import ChatBox from './components/ChatBox/ChatBox';

export const userContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  return (
    <userContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
        <Switch>
          <PrivateRoute path="/chats">
            <Chats />
          </PrivateRoute>
          <PrivateRoute path="/friends">
            <Friend />
          </PrivateRoute>
          <PrivateRoute path="/addFriends">
            <AddFriends />
          </PrivateRoute>
          <PrivateRoute path="/chat/:id">
            <ChatBox/>
          </PrivateRoute>
          <PrivateRoute exact path="/">
            <Chats />
          </PrivateRoute>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </userContext.Provider>
  );
}

export default App;
