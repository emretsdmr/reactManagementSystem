import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./Layout/Sidebar"
import { useState, useReducer, useEffect } from 'react';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Users from './Pages/User/Users';
import Roles from './Pages/Roles/Roles';
import MyInformations from './Pages/MyInformations';
import Profile from './Pages/Profile';
import { AuthContext } from "./Auth/Auth.js";
import Button from 'react-bootstrap/Button';
import { Routes, Route, Link } from "react-router-dom";
import Header from './Layout/Header';

const isAuthenticated = !!localStorage.getItem('token');
const expireDate = localStorage.getItem("expireDate");
const initialState = {
  token: 0,
  expireDate: 0,
  isAuthenticated
};
function reducer(state, action) {
  switch (action.type) {
    case 'login':
      localStorage.setItem("token", action.token);
      localStorage.setItem("expireDate", action.expireDate);
      localStorage.setItem("userId", action.userId);
      return {
        ...state,
        token: action.token,
        expireDate: action.expireDate,
        userId: action.userId,
        isAuthenticated: true
      }
    case 'logout':
      localStorage.removeItem("token");
      localStorage.removeItem("expireDate");
      localStorage.removeItem("userId");
      return {
        ...state,
        token: '',
        expireDate: '',
        userId: '',
        isAuthenticated: false
      }
    default:
      return state;
  }
}

function App() {
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("token") || ""
  );

  const setTokens = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setAuthTokens(data);
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const checkSession = () => {
    if (expireDate) {
      const expireDateNow = new Date();
      const expireDateFinal = new Date(expireDate);
      const currentHour = expireDateNow.getHours();
      const currentMin = expireDateNow.getMinutes();
      const expireHour = expireDateFinal.getHours();
      const expireMin = expireDateFinal.getMinutes();
      const expireTime = (expireHour * 60) + expireMin
      const currentTime = (currentHour * 60) + currentMin

      if (expireTime - currentTime <= 0) {
        dispatch({ type: 'logout' });
        window.location.reload();
      }
      else {
        console.log(expireTime - currentTime + " minutes left until the end of the session.")
      }
    }
    else {
      console.log("You are not logged in!");
    }
  }

  useEffect(() => {
    checkSession();
  }, [])

  return (
    <AuthContext.Provider value={{ state, authTokens, dispatch, setAuthTokens: setTokens }}>
      <div className="App">
      <Header />
        {isAuthenticated ?
          <>
          <Sidebar />            
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/myinformations" element={<MyInformations />} />
            </Routes>
          </> :
          <>
            <br /><br/><br/>            
            <Link to="/login"><Button variant="success">Login</Button></Link>
            &nbsp;
            <Link to="/register"><Button variant="secondary">Register</Button></Link>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </>}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
