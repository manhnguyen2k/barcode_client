// AppRouter.js
import React from 'react';
import { Routes ,Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login'; 
import { useSelector } from 'react-redux';
import Homepage from './Pages/Home';
import Fruno from './Screens/Fruno';
import Beckman from './Screens/Beckman';
import MainContent from './Pages/MainContent';
const AppRouter = () => {
    
    const isLogin = useSelector(state => state.auth.isLogin);
  
  return (
    <Routes>
    <Route exact path="/" element={isLogin?<Navigate to="/home" /> : <Login />} />
    <Route exact path="/home" element={isLogin? <MainContent />: <Navigate to="/" />} />
    {/*
   <Route exact path="/fruno_old" element={isLogin? <Fruno />: <Navigate to="/" />} />
   <Route exact path="/beckman" element={isLogin? <Beckman />: <Navigate to="/" />} />
    */}
  </Routes>
  
  
  );
};

export default AppRouter;
