// AppRouter.js
import React from 'react';
import { Routes ,Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login'; 
import { useSelector } from 'react-redux';
import Homepage from './Pages/Home';
import FrunoPage from './Screens/Fruno';
import BeckmanPage from './Screens/Beckman';

const AppRouter = () => {
    
    const isLogin = useSelector(state => state.auth.isLogin);
  
  return (
    <Routes>
    <Route exact path="/" element={isLogin?<Navigate to="/home" /> : <Login />} />
    <Route exact path="/home" element={isLogin? <Homepage />: <Navigate to="/" />} />
    <Route exact path="/fruno" element={isLogin? <FrunoPage />: <Navigate to="/" />} />
    <Route exact path="/beckman" element={isLogin? <BeckmanPage />: <Navigate to="/" />} />
    
  </Routes>
  
  
  );
};

export default AppRouter;
