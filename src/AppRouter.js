// AppRouter.js
import React, { useEffect } from 'react';
import { Router,Routes ,Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login'; // Import các component bạn muốn hiển thị
import { useSelector, useDispatch } from 'react-redux';
import Barcode1 from './barcode';
import Err from './dangnhap.err';
import Homepage from './Pages/Home';
import Fruno from './Screens/Fruno';
import Beckman from './Screens/Beckman';
const AppRouter = () => {
    const isLogin = useSelector(state => state.auth.isLogin);
   
    //console.log(isLogin)
  return (
    <Routes>
    <Route exact path="/" element={ <Login />} />
    <Route exact path="/home" element={ <Homepage />} />
    <Route exact path="/fruno" element={ <Fruno />} />
    <Route exact path="/beckman" element={ <Beckman />} />
    <Route path="/barcode" element={isLogin  ? <Barcode1 /> : <Navigate to="/" />} />
  </Routes>
  
  
  );
};

export default AppRouter;
